import { Body, Controller, Delete, Get, Post, Request } from "@nestjs/common";
import { CreateRelationDto } from "../dto/create-relation.dto";
import { RelationEntity } from "../entities/relation.entity";
import { RelationService } from "../services/relation.service";

@Controller("/friends")
export class RelationController {
  constructor(private readonly RelationService: RelationService) {}

  @Get("")
  async friend(@Request() Req): Promise<RelationEntity[]> {
    return this.RelationService.getFriend(Req.user.userId);
  }

  @Post("/")
  async follow(
    @Body() createRelationDto: CreateRelationDto,
    @Request() Req
  ): Promise<RelationEntity> {
    return this.RelationService.follow(createRelationDto, Req.user.userId);
  }

  @Delete("/")
  async unFollow(@Body() createRelationDto: CreateRelationDto): Promise<any> {
    return this.RelationService.unFollow(createRelationDto);
  }
}
