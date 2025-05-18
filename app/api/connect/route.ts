import { supabase } from '@/utils/supabase/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    if (req.method !== "POST") {
        return NextResponse.json({ error:"Method not allowed" }, { status: 500 });
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error: updateError } = await supabase.auth.updateUser({
        data: {
            isConnected: true,
        },
    });

    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    
    return NextResponse.json({ userId: user?.id });
}
