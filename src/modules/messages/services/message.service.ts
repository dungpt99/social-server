import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { commonDelete } from "src/common/helper/common-delete";
import { commonFilter } from "src/common/helper/common-filter";
import { ConversationService } from "src/modules/conversations/services/conversation.service";
import { ImagesService } from "src/modules/images/services/images.services";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { UserService } from "src/modules/user/services/user.service";
import { CreateMessageDto } from "../dto/create-message.dto";
import { MessageEntity } from "../entities/message.entity";
import { MessageRepository } from "../repositories/message.repository";

@Injectable()
export class MessageService {
  private readonly logger = new Logger();
  constructor(
    @InjectRepository(MessageRepository)
    private readonly messageRepository: MessageRepository,
    private readonly conversationService: ConversationService,
    private readonly userService: UserService,
    private readonly imageService: ImagesService
  ) {}

  async create(
    createMessageDto: CreateMessageDto,
    userId: string,
    imgArray: Array<any>
  ): Promise<MessageEntity> {
    const conversation = await this.conversationService.findById(
      createMessageDto.conversationId
    );
    const user = await this.userService.findById(userId);
    const messageModel = new MessageEntity();
    const newMessage = {
      ...messageModel,
      conversation,
      user,
    };
    newMessage.content = createMessageDto.content;
    try {
      const message = await this.messageRepository.save(newMessage);
      if (imgArray.length !== 0) {
        const arr = commonFilter(imgArray, message, "message");
        await this.imageService.create(arr);
      }

      return message;
    } catch (error) {
      commonDelete(imgArray);
      this.logger.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findAll(conversationId: string): Promise<MessageEntity[]> {
    return await this.messageRepository
      .createQueryBuilder("message")
      .leftJoinAndSelect("message.conversation", "conversation")
      .leftJoinAndSelect("message.images", "images")
      .where("conversation.id = :id", { id: conversationId })
      .getMany();
  }
}
