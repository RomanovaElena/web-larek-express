import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import Products from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import InternalServerError from '../errors/internal-server-error';

const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { total, items } = req.body;

    // получаем товары из базы
    const products = await Products.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      const foundedIds = products.map((p) => p._id.toString());
      const missingIds = items.filter((id: string) => !foundedIds.includes(id));
      return next(
        new NotFoundError(`Товары с id ${missingIds.join(', ')} не найдены`),
      );
    }

    // проверяем, что товары продаются
    const unavailable = products.filter((p) => p.price == null);
    if (unavailable.length > 0) {
      return next(
        new BadRequestError(
          `Следующие товары не продаются: ${unavailable
            .map((p) => p._id)
            .join(', ')}`,
        ),
      );
    }

    // проверяем total
    const sum = products.reduce((acc, p) => acc + (p.price ?? 0), 0);
    if (sum !== total) {
      return next(new BadRequestError('Неверная сумма заказа'));
    }

    // генерируем ID заказа
    const orderId = faker.string.uuid();

    return res.status(201).json({ id: orderId, total });
  } catch (err) {
    return next(new InternalServerError('Ошибка сервера при создании заказа'));
  }
};

export default createOrder;
