import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient as createSupabaseServerClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, planId } = body;
  if (!userId || !planId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const cookieStore = cookies();
  const supabase = await createSupabaseServerClient(cookieStore);
  const { error } = await supabase
    .from('profiles')
    .update({ tier: planId })
    .eq('id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
