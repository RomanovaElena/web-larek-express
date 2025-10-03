import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
} from '../controllers/product-controller';
import { productRouteValidator } from '../middlewares/validator';

const router = Router();

router.get('/', getAllProducts);
router.post('/', productRouteValidator, createProduct);

export default router;
