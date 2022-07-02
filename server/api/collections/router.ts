import express from 'express';
import controller from './controller';

export default express
    .Router()
    .post('/create', controller.create)
    .post('/update/:collectionId', controller.update)
    .get('/list', controller.list)
    .get('/featured', controller.getByFeatured)
    .get('/favourite', controller.getByFavourite)
    .get('/my-collections/:walletAddress', controller.getByUser)
    .get('/:collectionId', controller.getById)
