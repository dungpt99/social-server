import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateRelationDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  follow: string;
}
