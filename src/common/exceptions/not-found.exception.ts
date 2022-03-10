import { NotFoundException } from '@nestjs/common';
import { ErrorType } from '../enums/error-type.enum';

export class NotFoundRequestException extends NotFoundException {
  constructor() {
    super({
      errorType: ErrorType.BAD_REQUEST,
      message: 'Not found!',
    });
  }
}
