import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateRelationDto {
  @IsNotEmpty()
  follow: number;
}
