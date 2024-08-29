import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const { name } = await req.json();
  const token = crypto.randomBytes(16).toString('hex');

  await supabase.rpc('set_session_token', { p_token: null });

  const { data, error } = await supabase
    .from('sessions')
    .insert({ name, token })
    .select()
    .single();

  if (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.rpc('set_session_token', { p_token: token });

  const shareableLink = `${process.env.NEXT_PUBLIC_BASE_URL}/session/${data.id}?token=${token}`;

  return NextResponse.json({ ...data, shareableLink });
}