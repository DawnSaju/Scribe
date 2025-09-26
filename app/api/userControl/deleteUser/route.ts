import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('NEXT_PUBLIC_SUPABASE_URL is not set');
      return NextResponse.json({ error: "Server configuration error: Missing Supabase URL" }, { status: 500 });
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY is not set');
      return NextResponse.json({ error: "Server configuration error: Missing service role key" }, { status: 500 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { id } = await request.json();

    if (!id) {
      console.error('No user ID provided in request');
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }

    console.log('Starting user deletion process for ID:', id);

    const tablesToClean = [
      { table: 'learned_words', column: 'user_id' },
      { table: 'word_of_the_day', column: 'id' },
      { table: 'profiles', column: 'id' },
    ];
    
    let cleanupSuccess = true;
    
    for (const { table, column } of tablesToClean) {
      try {
        console.log(`Cleaning user data from table: ${table} where ${column} = ${id}`);
        const { error: dataError, count } = await supabaseAdmin
          .from(table)
          .delete({ count: 'exact' })
          .eq(column, id);
        
        if (dataError) {
          if (dataError.code === 'PGRST116') {
            console.log(`Table ${table} doesn't exist, skipping`);
          } else {
            console.warn(`Error deleting user data from ${table}:`, dataError);
            cleanupSuccess = false;
          }
        } else {
          console.log(`Successfully cleaned ${count || 0} records from ${table}`);
        }
      } catch (dataDeleteError) {
        console.warn(`Could not delete user data from ${table}:`, dataDeleteError);
        cleanupSuccess = false;
      }
    }

    console.log('Attempting to delete auth user with ID:', id);
    let { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      console.warn('Standard user deletion failed, trying alternative methods:', error.message);
      
      try {
        const { error: altError } = await supabaseAdmin.auth.admin.deleteUser(id, false);
        if (!altError) {
          console.log('User deleted successfully using alternative method');
          error = null;
        } else {
          console.warn('Alternative deletion method also failed:', altError.message);
        }
      } catch (altError) {
        console.warn('Alternative deletion method threw error:', altError);
      }
    }

    if (error) {
      console.error('All deletion methods failed:', {
        message: error.message,
        status: error.status,
        name: error.name,
        code: error.code
      });
      
      if (cleanupSuccess) {
        console.log('User data was cleaned up successfully, but auth user deletion failed');
        return NextResponse.json({ 
          error: "Your account data has been removed, but the login remains active due to database constraints. You can continue using the app or contact support for complete account removal.",
          partialSuccess: true
        }, { status: 206 });
      }
      
      if (error.message.includes('User not found')) {
        return NextResponse.json({ error: "User not found or already deleted" }, { status: 404 });
      } else if (error.message.includes('insufficient privileges')) {
        return NextResponse.json({ error: "Insufficient permissions to delete user" }, { status: 403 });
      } else if (error.code === 'unexpected_failure') {
        return NextResponse.json({ 
          error: "Unable to completely delete account due to database constraints. Your personal data has been removed but the login remains. Contact support if you need complete removal." 
        }, { status: 500 });
      } else {
        return NextResponse.json({ error: `Database error deleting user: ${error.message}` }, { status: 500 });
      }
    }

    console.log('User deleted successfully');
    return NextResponse.json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Unexpected error in deleteUser API:', error);
    return NextResponse.json({ 
      error: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
}
