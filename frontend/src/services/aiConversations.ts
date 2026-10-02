import { supabase } from '../lib/supabase';
import type { AssistantMessage } from '../types/ai';

export interface AIConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface AILoadedConversation extends AIConversation {
  messages: AssistantMessage[];
}

export const aiConversationsApi = {
  async getConversations(limit = 20): Promise<AIConversation[]> {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    return data || [];
  },
  
  async getConversation(id: string): Promise<AILoadedConversation | null> {
    if (!supabase) return null;
    
    const { data: convData, error: convError } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('id', id)
      .single();
      
    if (convError || !convData) return null;
    
    const { data: msgData, error: msgError } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });
      
    if (msgError) throw msgError;
    
    return {
      ...convData,
      messages: (msgData || []).map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }))
    };
  },
  
  async createConversation(title: string): Promise<AIConversation | null> {
    if (!supabase) return null;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('ai_conversations')
      .insert({ title, user_id: user.id })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async addMessage(conversationId: string, message: AssistantMessage): Promise<void> {
    if (!supabase) return;
    
    const { error } = await supabase
      .from('ai_messages')
      .insert({
        conversation_id: conversationId,
        role: message.role,
        content: message.content
      });
      
    if (error) throw error;
    
    // Update conversation timestamp
    await supabase
      .from('ai_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);
  },
  
  async deleteConversation(id: string): Promise<void> {
    if (!supabase) return;
    
    const { error } = await supabase
      .from('ai_conversations')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  }
};
