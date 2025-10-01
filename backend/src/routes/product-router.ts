import { Router } from 'express';
import {
  createProduct,
  getAllProducts
} from '../controllers/product-controller';
import { productRouteValidator, validateId } from '../middlewares/validator';

const router = Router();

router.get('/', getAllProducts);
router.post('/', validateId, productRouteValidator, createProduct);

export default router;