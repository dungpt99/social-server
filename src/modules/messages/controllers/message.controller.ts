import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CreateMessageDto } from "../dto/create-message.dto";
import { MessageEntity } from "../entities/message.entity";
import { MessageService } from "../services/message.service";

@Controller("messages")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post("")
  @UseInterceptors(FilesInterceptor("files"))
  async create(
    @Request() Req,
    @Body() body: CreateMessageDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ): Promise<MessageEntity> {
    return this.messageService.create(body, Req.user.userId, files);
  }

  @Get("/:id")
  async findAll(@Param("id", ParseUUIDPipe) id: string) {
    return this.messageService.findAll(id);
  }
}
