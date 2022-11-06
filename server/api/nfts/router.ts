import express from 'express';
import controller from './controller';

export default express
    .Router()
    .post('/create', controller.create)
    // .post('/bulkCreate', controller.bulkCreate)
    .post('/update/:nftId', controller.update)
    // .get('/asdf', controller.asdf)
    .post('/updateOwner/:nftId', controller.updateOwner)
    // .post('/bulkUpdate', controller.bulkUpdate)
    .get('/list', controller.list)
    .get('/getAllCategories',controller.getAllCategories)
    .get('/:nftId', controller.getNftById)
    .get('/get-by-user/:userWallet',controller.getNftByUser)
    .post('/transfer/:nftId', controller.transfer)