import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class Authentication implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.sendStatus(401);
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, data) => {
      req.body.user = data;
      if (err) return res.sendStatus(403);
      next();
    });
  }
}
