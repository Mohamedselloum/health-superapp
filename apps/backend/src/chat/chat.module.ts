import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { AiAssistantService } from './ai-assistant.service';
import { createSupabaseClient } from '../config/supabase.config';

@Module({
  imports: [ConfigModule],
  controllers: [ChatController],
  providers: [
    ChatService,
    AiAssistantService,
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: (configService: ConfigService) =>
        createSupabaseClient(configService),
      inject: [ConfigService],
    },
  ],
  exports: [ChatService, AiAssistantService],
})
export class ChatModule {}

