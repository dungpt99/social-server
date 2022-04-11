import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageDto {
  @IsNotEmpty()
  content: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  conversationId: string;

  @ApiProperty({ type: String, format: "binary" })
  files?: string;
}
