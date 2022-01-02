import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { ConversationEntity } from '../entities/conversation.entity';
import { ConversationService } from '../services/conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly ConversationService: ConversationService,
    private readonly UserService: UserService,
  ) {}

  @Post()
  async create(
    @Body() CreateConversationDto: CreateConversationDto,
    @Request() Req,
  ): Promise<ConversationEntity> {
    const sender = await this.UserService.getById(Req.user.userId);
    const receiver = await this.UserService.getById(
      CreateConversationDto.receiverId,
    );
    return this.ConversationService.create(sender, receiver);
  }

  @Get('/:receiverId')
  async findOne(@Request() Req): Promise<ConversationEntity> {
    return this.ConversationService.findOne(
      Req.params.receiverId,
      Req.user.userId,
    );
  }

  @Get('/user/:conversationId')
  async findUser(@Request() Req): Promise<ConversationEntity> {
    return this.ConversationService.getUser(Req.params.conversationId);
  }

  @Get()
  async getMany(@Request() Req): Promise<ConversationEntity[]> {
    return this.ConversationService.getMany(Req.user.userId);
  }
}