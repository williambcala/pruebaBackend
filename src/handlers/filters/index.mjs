import { Router } from 'express';
import multer from 'multer';
import applyFilterHandler from './applyFiltersHandler.mjs';
import getFiltersHandler from './getFiltersHandler.mjs';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 50 } }); // 50mb

router.post('/', upload.array('images[]'), applyFilterHandler);

router.get('/:id', getFiltersHandler);

export const test = () => {};
export default router;
