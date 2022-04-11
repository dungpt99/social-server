import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  name?: string;
}
