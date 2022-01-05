import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { ConversationService } from 'src/modules/conversations/services/conversation.service';
import { UserService } from 'src/modules/user/services/user.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { MessageEntity } from '../entities/message.entity';
import { MessageService } from '../services/message.service';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly MessageService: MessageService,
    private readonly ConversationService: ConversationService,
    private readonly UserService: UserService,
  ) {}

  /**
   * Create
   */
  @Post()
  async create(
    @Body() CreateMessageDto: CreateMessageDto,
    @Request() Req,
  ): Promise<MessageEntity> {
    const conversation = await this.ConversationService.findOne(
      CreateMessageDto.receiverId,
    );
    const user = await this.UserService.getById(Req.user.userId);
    return this.MessageService.create(CreateMessageDto, conversation, user);
  }

  @Get(':conversationReceiverId')
  async getMessages(@Request() Req): Promise<MessageEntity[]> {
    return this.MessageService.getMany(Req.params.conversationReceiverId);
  }
}
