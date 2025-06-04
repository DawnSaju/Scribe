import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  const cookieStore = cookies(); 
  const supabase = await createClient(cookieStore);

  const { userinput } = await req.json();

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser()

  if (sessionError || !user || !user.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  if (!userinput || userinput.trim().length < 2) {
    return NextResponse.json({ users: [] });
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url')
    .or(`email.ilike.%${userinput}%,full_name.ilike.%${userinput}%`)
    .neq('id', user.id)
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data });
}
