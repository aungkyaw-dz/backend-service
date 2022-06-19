import express from 'express';
import controller from './controller';

export default express
    .Router()
    .post('/create', controller.create)
    .post('/update/:nftId', controller.update)
    .get('/list', controller.list)
    .get('/:nftId', controller.getNftById)
    .get('/get-by-user/:userWallet',controller.list)
    .post('/transfer/:nftId', controller.transfer)