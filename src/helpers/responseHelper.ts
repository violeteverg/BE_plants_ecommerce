import { HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

export class ResponseHelper {
  responseSuccess = (res: Response, code: HttpStatus, message: string) => {
    res.status(code).send({
      code,
      status: 'success',
      message: message,
    });
  };

  responseSuccessData = (
    res: Response,
    code: HttpStatus,
    message: string,
    data,
    pagination?,
  ) => {
    res.status(code).send({
      code,
      status: 'success',
      message,
      data,
      pagination,
    });
  };

  responseServerError = (res: Response, error: Error) => {
    const logger = new Logger();
    logger.error(error);
    return res.status(500).send({
      code: 500,
      status: 'error',
      message: 'internal server error',
    });
  };
}
