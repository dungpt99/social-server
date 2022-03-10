import { ApiProperty } from "@nestjs/swagger";
import { CommonPaginationDto } from "src/common/dto/pagination.dto";

export class GetPostsDto extends CommonPaginationDto {
  @ApiProperty({ required: false })
  order?: string;
}
