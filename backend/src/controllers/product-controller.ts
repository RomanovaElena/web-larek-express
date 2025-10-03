import { Request, Response, NextFunction } from "express";
import Products from "../models/product";
import ConflictError from "../errors/conflict-error";
import InternalServerError from "../errors/internal-server-error";

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Products.find({});
    res.status(200).json({ items: products, total: products.length });
  } catch (error) {
    next(new InternalServerError("Ошибка сервера при получении товаров"));
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, image, category, description, price } = req.body;

    // проверка на дубликат title
    const existingProduct = await Products.findOne({ title });
    if (existingProduct) {
      return next(new ConflictError("Товар с таким title уже существует"));
    }

    const newProduct = {
      title,
      image,
      category,
      description: description ?? "",
      price: price ?? null,
    };
    return res.status(201).json(newProduct);
  } catch (error) {
    return next(new InternalServerError("Ошибка сервера при создании товара"));
  }
};
