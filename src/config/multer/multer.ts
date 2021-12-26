import { Injectable, Req } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: function (req, file, cb) {
          cb(null, './public/uploads');
        },
        filename: (req, file, cb) => {
          cb(null, Date.now() + file.originalname);
        },
      }),
    };
  }
  use(req, res, next: Function) {}
}
