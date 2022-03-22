import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/modules/user/services/user.service";
import { CreateConversationDto } from "../dto/create-conversation.dto";
import { ConversationEntity } from "../entities/conversation.entity";
import { ConversationRepository } from "../repositories/conversation.repository";

@Injectable()
export class ConversationService {
  private readonly logger = new Logger();
  constructor(
    @InjectRepository(ConversationRepository)
    private readonly conversationRepository: ConversationRepository,
    private readonly userService: UserService
  ) {}

  async create(
    senderId: string,
    createConversationDto: CreateConversationDto
  ): Promise<ConversationEntity> {
    const conversationSender = await this.findAll(senderId);
    const conversationReceiver = await this.findAll(
      createConversationDto.receiverId
    );

    conversationReceiver.map((receiver) => {
      conversationSender.map((sender) => {
        if (receiver.id === sender.id) {
          throw new InternalServerErrorException();
        }
      });
    });

    const sender = await this.userService.findById(senderId);
    const receiver = await this.userService.findById(
      createConversationDto.receiverId
    );
    try {
      const conversationModel = new ConversationEntity();
      const newConversation = {
        ...conversationModel,
      };
      newConversation.users = [sender, receiver];
      return await this.conversationRepository.save(newConversation);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findAll(userId: string): Promise<ConversationEntity[]> {
    const conversations = await this.conversationRepository
      .createQueryBuilder("conversation")
      .leftJoinAndSelect("conversation.users", "user")
      .where("user.id = :id", { id: userId })
      .getMany();
    return conversations;
  }

  async findById(conversationId: string): Promise<ConversationEntity> {
    try {
      const getConversation = await this.conversationRepository.findOne({
        relations: ["users", "messages"],
        where: { id: conversationId },
      });

      if (!getConversation) {
        throw new NotFoundException();
      }

      return getConversation;
    } catch (error) {
      this.logger.log(error.toString());
      throw new InternalServerErrorException();
    }
  }

  async delete(id: string): Promise<ConversationEntity> {
    const getConversation = await this.conversationRepository.findOne(id);

    if (!getConversation) {
      throw new NotFoundException();
    }
    try {
      return await this.conversationRepository.remove(getConversation);
    } catch (error) {
      this.logger.log(error.toString());
      throw new InternalServerErrorException();
    }
  }
}
