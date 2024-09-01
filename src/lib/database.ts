import { createClient } from '@supabase/supabase-js';
import { StickerType } from '@/components/Sticker';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchSessionName(id: string): Promise<string> {
  const { data, error } = await supabase
    .from('sessions')
    .select('name')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching session:', error);
    return '';
  }
  return data.name;
}

export async function fetchStickers(sessionId: string): Promise<StickerType[]> {
  const { data, error } = await supabase
    .from('stickers')
    .select('*')
    .eq('session_id', sessionId)
    .order('votes', { ascending: false });

  if (error) {
    console.error('Error fetching stickers:', error);
    return [];
  }
  return data || [];
}

export function setupRealtimeSubscription(sessionId: string, callback: () => void) {
  const channel = supabase
    .channel('public:stickers')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'stickers' }, callback)
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function voteSticker(stickerId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_vote', { sticker_id: stickerId });
  if (error) {
    console.error('Error voting:', error);
  }
}

export async function unvoteSticker(stickerId: string): Promise<void> {
  const { error } = await supabase.rpc('decrement_vote', { sticker_id: stickerId });
  if (error) {
    console.error('Error unvoting:', error);
  }
}

export async function deleteSticker(stickerId: string): Promise<void> {
  const { error } = await supabase
    .from('stickers')
    .delete()
    .eq('id', stickerId);
  if (error) {
    console.error('Error deleting sticker:', error);
  }
}

export async function createSticker(sessionId: string, text: string, author: string): Promise<StickerType | null> {
  const { data, error } = await supabase
    .from('stickers')
    .insert({ session_id: sessionId, text, author })
    .select()
    .single();

  if (error) {
    console.error('Error creating sticker:', error);
    return null;
  }
  return data;
}

export interface Session {
  id: string;
  name: string;
}

export async function fetchSessions(): Promise<Session[]> {
  const { data, error } = await supabase
    .from('sessions')
    .select('id, name')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }

  return data || [];
}