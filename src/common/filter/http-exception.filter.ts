import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from "express";
import { ILog } from "../logger/log.interface";
import { CommonLogger } from "../logger/common-logger";
import {
  CustomHttpExceptionResponse,
  HttpExceptionResponse,
} from "./http-exception-response.interface";
import * as fs from "fs";

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new CommonLogger("HttpExceptionFilter");

  catch(exception: HttpException, host: ArgumentsHost) {
    let status: HttpStatus;
    let errorMessage: string;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      errorMessage =
        (errorResponse as HttpExceptionResponse).error || exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = "Critical internal server error occurred!";
    }

    const errorResponse = this.getErrorResponse(status, errorMessage, request);
    const errorLog = this.getErrorLog(errorResponse, request, exception);
    this.writeErrorLogToFile(errorLog);
    response.status(status).json(errorResponse);

    const thisLog: ILog = {
      endpoint: request.path,
      ipAddress:
        request.headers["x-forwarded-for"] || request.connection.remoteAddress,
      method: request.method,
      error: exception,
    };

    this.logger.customError(exception.message, exception.stack, thisLog);

    // super.catch(exception, host);
  }

  private getErrorResponse = (
    status: HttpStatus,
    errorMessage: string,
    request: Request
  ): CustomHttpExceptionResponse => ({
    statusCode: status,
    error: errorMessage,
    path: request.url,
    method: request.method,
    timestamp: new Date(),
  });

  private getErrorLog = (
    errorResponse: CustomHttpExceptionResponse,
    request: Request,
    exception: unknown
  ): string => {
    const { statusCode, error } = errorResponse;
    const { method, url } = request;
    const errorLog = `Response Code: ${statusCode} - Method: ${method} - URL: ${url}\n\n
    ${JSON.stringify(errorResponse)}\n\n
    ${exception instanceof HttpException ? exception.stack : error}\n\n`;
    return errorLog;
  };

  private writeErrorLogToFile = (errorLog: string): void => {
    fs.appendFile("error.log", errorLog, "utf8", (err) => {
      if (err) throw err;
    });
  };
}
