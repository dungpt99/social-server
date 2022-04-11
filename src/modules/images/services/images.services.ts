import {
  Injectable,
  InternalServerErrorException,
  Logger
} from "@nestjs/common";
import { ImageRepository } from "../repositories/image.repository";

@Injectable()
export class ImagesService {
  private readonly logger = new Logger();
  constructor(private readonly imageRepository: ImageRepository) {}

  async create(array: any): Promise<any> {
    try {
      return await this.imageRepository
        .createQueryBuilder("image")
        .insert()
        .values(array)
        .execute();
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteMany(ids: any) {
    return await this.imageRepository
      .createQueryBuilder("image")
      .delete()
      .where("id IN (:...ids)", {
        ids
      })
      .execute();
  }
}
