import express from 'express';
import controller from './controller';

export default express
    .Router()
    .post('/create', controller.create)
    .post('/update/:collectionName', controller.update)
    .get('/list', controller.list)
    .get('/featured', controller.getByFeatured)
    .get('/favourite', controller.getByFavourite)
    .get('/my-collections/:walletAddress', controller.getByUser)
    .get('/:collectionName', controller.getByName)
