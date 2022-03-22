import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
} from "@nestjs/common";
import { CreateConversationDto } from "../dto/create-conversation.dto";
import { ConversationEntity } from "../entities/conversation.entity";
import { ConversationService } from "../services/conversation.service";

@Controller("conversations")
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  async create(
    @Body() createConversationDto: CreateConversationDto,
    @Request() Req
  ): Promise<ConversationEntity> {
    return this.conversationService.create(
      Req.user.userId,
      createConversationDto
    );
  }

  @Get()
  async getMany(@Request() Req): Promise<ConversationEntity[]> {
    return this.conversationService.findAll(Req.user.userId);
  }

  @Get("/:id")
  async findOne(
    @Param("id", ParseUUIDPipe) id: string
  ): Promise<ConversationEntity> {
    return this.conversationService.findById(id);
  }
}
