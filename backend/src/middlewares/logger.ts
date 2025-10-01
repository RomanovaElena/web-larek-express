import winston from 'winston';
import expressWinston from 'express-winston';

//логгер запросов
export const requestLogger = expressWinston.logger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: 'request.log' })],
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
});

// логгер ошибок
export const errorLogger = expressWinston.errorLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [new winston.transports.File({ filename: 'error.log' })],
  meta: true,
  msg: 'ERROR {{err.message}}',
});