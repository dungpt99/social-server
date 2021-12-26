import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  content: string;

  @IsNumber()
  receiverId: number;
}
