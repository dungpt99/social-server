import { Injectable } from "@nestjs/common";
import { MulterOptionsFactory } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from "multer";

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterOptions {
    return {
      storage: diskStorage({
        destination: function (req, file, cb) {
          cb(null, "./public/uploads");
        },
        filename: (req, file, cb) => {
          cb(null, Date.now() + file.originalname);
        },
      }),
    };
  }
}
