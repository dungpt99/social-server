import { BadRequestException } from '@nestjs/common';
import { ErrorType } from '../enums/error-type.enum';

export class SampleBadRequestException extends BadRequestException {
  constructor() {
    super({
      errorType: ErrorType.BAD_REQUEST,
      message: 'Bad request!',
    });
  }
}
