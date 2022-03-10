import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePostDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  desc: string;
}
