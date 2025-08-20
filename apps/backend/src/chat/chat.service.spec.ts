import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { AiAssistantService } from './ai-assistant.service';

describe('ChatService', () => {
  let service: ChatService;
  let supabaseClient: SupabaseClient;
  let aiAssistantService: AiAssistantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: SupabaseClient,
          useValue: {
            from: jest.fn(() => ({
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              order: jest.fn().mockReturnThis(),
              insert: jest.fn().mockReturnThis(),
              update: jest.fn().mockReturnThis(),
              delete: jest.fn().mockReturnThis(),
              single: jest.fn().mockReturnThis(),
              data: [],
              error: null,
            })),
          },
        },
        {
          provide: AiAssistantService,
          useValue: {
            getAssistantResponse: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    supabaseClient = module.get<SupabaseClient>(SupabaseClient);
    aiAssistantService = module.get<AiAssistantService>(AiAssistantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMessage', () => {
    it('should create a new message and get AI response', async () => {
      const newMessage = { userId: 'user1', content: 'Hello AI' };
      const createdMessage = { id: 1, ...newMessage, timestamp: new Date().toISOString() };
      const aiResponse = 'Hello user!';

      (supabaseClient.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({ data: createdMessage, error: null }),
      });
      (aiAssistantService.getAssistantResponse as jest.Mock).mockResolvedValue(aiResponse);

      const result = await service.createMessage(newMessage.userId, newMessage.content);
      expect(result).toEqual(createdMessage);
      expect(supabaseClient.from).toHaveBeenCalledWith('chat_messages');
      expect(supabaseClient.from('chat_messages').insert).toHaveBeenCalledWith({
        user_id: newMessage.userId,
        content: newMessage.content,
        sender: 'user',
      });
      expect(aiAssistantService.getAssistantResponse).toHaveBeenCalledWith(newMessage.content);
      expect(supabaseClient.from('chat_messages').insert).toHaveBeenCalledWith({
        user_id: newMessage.userId,
        content: aiResponse,
        sender: 'ai',
      });
    });

    it('should throw an error if message creation fails', async () => {
      const newMessage = { userId: 'user1', content: 'Hello AI' };
      const mockError = { message: 'Creation failed' };

      (supabaseClient.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({ data: null, error: mockError }),
      });

      await expect(service.createMessage(newMessage.userId, newMessage.content)).rejects.toThrow(mockError.message);
    });
  });

  describe('getMessagesForUser', () => {
    it('should return messages for a given user', async () => {
      const mockMessages = [
        { id: 1, user_id: 'user1', content: 'Hi', sender: 'user' },
        { id: 2, user_id: 'user1', content: 'Hello', sender: 'ai' },
      ];
      (supabaseClient.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        data: mockMessages,
        error: null,
      });

      const result = await service.getMessagesForUser('user1');
      expect(result).toEqual(mockMessages);
      expect(supabaseClient.from).toHaveBeenCalledWith('chat_messages');
      expect(supabaseClient.from('chat_messages').eq).toHaveBeenCalledWith('user_id', 'user1');
    });

    it('should throw an error if fetching messages fails', async () => {
      const mockError = { message: 'Failed to fetch messages' };
      (supabaseClient.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        data: null,
        error: mockError,
      });

      await expect(service.getMessagesForUser('user1')).rejects.toThrow(mockError.message);
    });
  });
});

