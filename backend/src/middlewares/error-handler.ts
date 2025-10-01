import { Request, Response, NextFunction } from 'express';
import { isCelebrateError, CelebrateError } from 'celebrate';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import InternalServerError from '../errors/internal-server-error';
import NotFoundError from '../errors/not-found-error';

const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let message = 'Internal server error';

  // celebrate ошибки
  if (isCelebrateError(err)) {
    const celebrateErr = err as CelebrateError;
    const errorDetail =
      celebrateErr.details.get('body') ||
      celebrateErr.details.get('params') ||
      celebrateErr.details.get('query') ||
      celebrateErr.details.get('headers');
    statusCode = 400;
    message = errorDetail?.message ?? 'Ошибка в валидации данных';
  }
  // кастомные ошибки
  else if (err instanceof BadRequestError || err instanceof ConflictError ||
           err instanceof NotFoundError || err instanceof InternalServerError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // mongoDB дубликаты (E11000)
  else if (err instanceof Error && err.message.includes('E11000')) {
    statusCode = 409;
    message = 'Товар с таким названием уже существует';
  }

  // логирование для разработки
  if (process.env.NODE_ENV !== 'production') {
    console.error('Ошибка:', err);
  }

  return res.status(statusCode).json({ message });
};

export default errorHandler;