import express, { Application } from 'express';
import adminRouter from './api/admin/router';
import userRouter from './api/users/router';
import nftRouter from './api/nfts/router';
import collectionRouter from './api/collections/router';
import listRouter from './api/lists/router';
const router = express.Router()

router.use('/admin', adminRouter)
router.use('/users', userRouter)
router.use('/nfts', nftRouter)
router.use('/collections', collectionRouter)
router.use('/lists', listRouter)

export default router