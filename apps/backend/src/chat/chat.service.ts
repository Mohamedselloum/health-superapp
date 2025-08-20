import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { SupabaseClient } from '../config/supabase.config';
import { AiAssistantService, ChatMessage, SymptomIntake } from './ai-assistant.service';
import { CreateChatSessionDto, SendMessageDto, SymptomIntakeDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
    private aiAssistantService: AiAssistantService
  ) {}

  async createSession(userId: string, createSessionDto: CreateChatSessionDto) {
    const { data, error } = await this.supabase
      .from('chat_sessions')
      .insert({
        user_id: userId,
        language: createSessionDto.language || 'en'
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create chat session: ${error.message}`);
    }

    // Add welcome message
    await this.addMessage(data.id, {
      role: 'assistant',
      content: 'Hello! I\'m your AI Health Assistant. Before we begin, I\'d like to gather some information about your symptoms to better assist you. Would you like to start with a symptom intake form?'
    });

    return data;
  }

  async getSession(sessionId: string, userId: string) {
    const { data, error } = await this.supabase
      .from('chat_sessions')
      .select(`
        *,
        messages:chat_messages(*)
      `)
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new NotFoundException(`Chat session not found`);
    }

    return data;
  }

  async getUserSessions(userId: string) {
    const { data, error } = await this.supabase
      .from('chat_sessions')
      .select(`
        *,
        latest_message:chat_messages(content, created_at)
      `)
      .eq('user_id', userId)
      .order('started_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch user sessions: ${error.message}`);
    }

    return data;
  }

  async sendMessage(sessionId: string, userId: string, sendMessageDto: SendMessageDto) {
    // Verify session belongs to user
    const session = await this.getSession(sessionId, userId);
    
    // Add user message
    await this.addMessage(sessionId, {
      role: 'user',
      content: sendMessageDto.content
    });

    // Get conversation history
    const messages = await this.getMessages(sessionId);
    
    // Generate AI response
    const aiResponse = await this.aiAssistantService.generateChatResponse(
      messages.map(m => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
        tool_calls: m.tool_calls_jsonb
      }))
    );

    // Add AI response
    const responseMessage = await this.addMessage(sessionId, aiResponse);

    return responseMessage;
  }

  async processSymptomIntake(sessionId: string, userId: string, intakeDto: SymptomIntakeDto) {
    // Verify session belongs to user
    await this.getSession(sessionId, userId);

    // Store symptom intake
    const { data: intakeData, error: intakeError } = await this.supabase
      .from('symptom_intakes')
      .insert({
        user_id: userId,
        answers_jsonb: intakeDto
      })
      .select()
      .single();

    if (intakeError) {
      throw new Error(`Failed to store symptom intake: ${intakeError.message}`);
    }

    // Process triage
    const triageResult = await this.aiAssistantService.processSymptomIntake(intakeDto);

    // Update intake with triage result
    await this.supabase
      .from('symptom_intakes')
      .update({
        triage: triageResult.level,
        recommended_guide_ids: triageResult.recommended_guides || []
      })
      .eq('id', intakeData.id);

    // Generate response message based on triage
    let responseContent = `Thank you for completing the symptom intake. Based on your responses:\n\n`;
    responseContent += `**Assessment**: ${triageResult.reasoning}\n\n`;
    responseContent += `**Recommendations**:\n`;
    triageResult.recommendations.forEach(rec => {
      responseContent += `• ${rec}\n`;
    });

    if (triageResult.level === 'urgent') {
      responseContent += `\n🚨 **URGENT**: Please seek immediate medical attention.`;
    }

    responseContent += `\n\n*Disclaimer: This assessment is for informational purposes only and does not replace professional medical advice.*`;

    // Add system message with triage result
    const responseMessage = await this.addMessage(sessionId, {
      role: 'assistant',
      content: responseContent
    });

    return {
      intake: intakeData,
      triage: triageResult,
      message: responseMessage
    };
  }

  async endSession(sessionId: string, userId: string) {
    // Verify session belongs to user
    await this.getSession(sessionId, userId);

    const { data, error } = await this.supabase
      .from('chat_sessions')
      .update({ ended_at: new Date().toISOString() })
      .eq('id', sessionId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to end chat session: ${error.message}`);
    }

    return data;
  }

  private async addMessage(sessionId: string, message: ChatMessage) {
    const { data, error } = await this.supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role: message.role,
        content: message.content,
        tool_calls_jsonb: message.tool_calls || null
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add message: ${error.message}`);
    }

    return data;
  }

  private async getMessages(sessionId: string) {
    const { data, error } = await this.supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }

    return data;
  }

  async getSymptomIntakes(userId: string) {
    const { data, error } = await this.supabase
      .from('symptom_intakes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch symptom intakes: ${error.message}`);
    }

    return data;
  }
}

