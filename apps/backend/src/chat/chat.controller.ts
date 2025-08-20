import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateChatSessionDto, SendMessageDto, SymptomIntakeDto } from './dto/chat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Chat & AI Assistant')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('sessions')
  @ApiOperation({ summary: 'Create new chat session' })
  @ApiResponse({ status: 201, description: 'Chat session created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createSession(@Body() createSessionDto: CreateChatSessionDto, @Request() req) {
    return this.chatService.createSession(req.user.sub, createSessionDto);
  }

  @Get('sessions')
  @ApiOperation({ summary: 'Get user chat sessions' })
  @ApiResponse({ status: 200, description: 'Chat sessions retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUserSessions(@Request() req) {
    return this.chatService.getUserSessions(req.user.sub);
  }

  @Get('sessions/:sessionId')
  @ApiOperation({ summary: 'Get chat session with messages' })
  @ApiResponse({ status: 200, description: 'Chat session retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  getSession(@Param('sessionId') sessionId: string, @Request() req) {
    return this.chatService.getSession(sessionId, req.user.sub);
  }

  @Post('sessions/:sessionId/messages')
  @ApiOperation({ summary: 'Send message in chat session' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  sendMessage(
    @Param('sessionId') sessionId: string,
    @Body() sendMessageDto: SendMessageDto,
    @Request() req
  ) {
    return this.chatService.sendMessage(sessionId, req.user.sub, sendMessageDto);
  }

  @Post('sessions/:sessionId/symptom-intake')
  @ApiOperation({ summary: 'Submit symptom intake form' })
  @ApiResponse({ status: 201, description: 'Symptom intake processed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  processSymptomIntake(
    @Param('sessionId') sessionId: string,
    @Body() intakeDto: SymptomIntakeDto,
    @Request() req
  ) {
    return this.chatService.processSymptomIntake(sessionId, req.user.sub, intakeDto);
  }

  @Patch('sessions/:sessionId/end')
  @ApiOperation({ summary: 'End chat session' })
  @ApiResponse({ status: 200, description: 'Chat session ended successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  endSession(@Param('sessionId') sessionId: string, @Request() req) {
    return this.chatService.endSession(sessionId, req.user.sub);
  }

  @Get('symptom-intakes')
  @ApiOperation({ summary: 'Get user symptom intake history' })
  @ApiResponse({ status: 200, description: 'Symptom intakes retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getSymptomIntakes(@Request() req) {
    return this.chatService.getSymptomIntakes(req.user.sub);
  }
}

