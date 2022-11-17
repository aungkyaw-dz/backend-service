import express from 'express';
import controller from './controller';

export default express
    .Router()
    .post('/update/:listId', controller.update)
    .get('/list', controller.list)
