import { Request, Response } from 'express';
import * as Interfaces from '../../config/interface';
import ListHelper from './helper';
import SetResponse, { RESPONSES } from '../../config/response'
// import { UploadImage } from '../../middleware/imagekitUpload';
import UserHelper from '../users/helper'
const { Op } = require("sequelize");class Controller {

  update = async (
      req: Request,
      res: Response
    ): Promise<Interfaces.PromiseResponse> => {
      try {
        const data = req.body
        const listId = req.params.listId
        const resData = await ListHelper.update(data, {listId})
        
        return SetResponse.success(res, RESPONSES.SUCCESS, {
            error: false,
            data : resData
          });
      } catch (error: any) {
          return SetResponse.error(res, RESPONSES.BADREQUEST, {
              error: true,
            });
      }
    };

  list = async (
      req: Request,
      res: Response
    ): Promise<Interfaces.PromiseResponse> => {
      try {
          console.log(req)
          return SetResponse.success(res, RESPONSES.SUCCESS, {
              error: false,
              data: "resData"
            });
      } catch (error: any) {
          return SetResponse.error(res, RESPONSES.BADREQUEST, {
              error: true,
            });
      }
    };

  getById = async (
        req: Request,
        res: Response
      ): Promise<Interfaces.PromiseResponse> => {
        try {
            const listId = req.params.listId
            const resData = await ListHelper.getListById({listId})
            return SetResponse.success(res, RESPONSES.SUCCESS, {
                error: false,
                data: resData
              });
        } catch (error: any) {
            return SetResponse.error(res, RESPONSES.BADREQUEST, {
                error: true,
              });
        }
      }

}

export default new Controller