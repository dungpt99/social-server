import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateLikeDto {
  @IsNotEmpty()
  postId: number;
}
