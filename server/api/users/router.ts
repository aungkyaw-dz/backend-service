import express from 'express';
import controller from './controller';

export default express
    .Router()
    .post('/get-or-create',controller.getUserOrCreat)
    .post('/edit/:walletAddress',controller.updateUser)
    .get('/:walletAddress',controller.getUser)