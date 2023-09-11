import express from 'express';
import { createTransaction } from '../controllers/transactionController';
import { auth } from '../middlewares/auth';

const router = express.Router();

router.post('/', auth, createTransaction);

export default router;