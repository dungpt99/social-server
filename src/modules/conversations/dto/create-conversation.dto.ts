import { IsNotEmpty } from "class-validator";

export class CreateConversationDto {
  @IsNotEmpty()
  receiverId: string;
}
