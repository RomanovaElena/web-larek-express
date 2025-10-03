import { celebrate, Joi, Segments } from 'celebrate';

// валидация продукта
const productSchema = Joi.object({
  title: Joi.string().min(2).max(30).required()
    .messages({
      'string.min': 'Минимальная длина поля title - 2',
      'string.max': 'Максимальная длина поля title - 30',
      'string.empty': 'Поле title не может быть пустым',
      'any.required': 'Поле title должно быть заполнено',
    }),
  image: Joi.object({
    fileName: Joi.string().required().messages({
      'any.required': 'Поле fileName обязательно',
    }),
    originalName: Joi.string().required().messages({
      'any.required': 'Поле originalName обязательно',
    }),
  })
    .required()
    .messages({
      'any.required': 'Изображение обязательно',
    }),
  category: Joi.string().required().messages({
    'any.required': 'Выберите категорию',
  }),
  description: Joi.string().allow(null, ''),
  price: Joi.number().allow(null).default(null),
});

export const productRouteValidator = celebrate({
  [Segments.BODY]: productSchema,
});

// валидация заказа
const orderSchema = Joi.object({
  payment: Joi.string().valid('card', 'online').required().messages({
    'any.only': 'Способ оплаты должен быть card или online',
    'any.required': 'Выберите способ оплаты',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Неверный формат email',
    'any.required': 'Заполните email',
  }),
  phone: Joi.string().required().messages({
    'any.required': 'Заполните номер телефона',
  }),
  address: Joi.string().required().messages({
    'any.required': 'Заполните адрес',
  }),
  total: Joi.number().required().messages({
    'any.required': 'Общая сумма заказа обязательна',
  }),
  items: Joi.array()
    .items(
      Joi.string().hex().length(24).messages({
        'string.hex': 'Id товара должен быть в hex-формате',
        'string.length': 'Id товара должен состоять из 24 символов',
      }),
    )
    .min(1)
    .required()
    .messages({
      'any.required': 'Добавьте хотя бы один товар',
    }),
});

export const orderRouteValidator = celebrate({
  [Segments.BODY]: orderSchema,
});
