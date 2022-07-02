import { Request, Response } from 'express';
import * as Interfaces from '../../config/interface';
import CollectionHelper from './helper';
import SetResponse, { RESPONSES } from '../../config/response'
import { UploadImage } from '../../middleware/imagekitUpload';
import UserHelper from '../users/helper'
class Controller {
  create = async (
      req: Request,
      res: Response
    ): Promise<Interfaces.PromiseResponse> => {
      try {
        const data = req.body
        const walletAddress = data.creator
        const user = await UserHelper.getOrCreate({walletAddress: walletAddress})
        data.creator = user
        const resData = await CollectionHelper.create(data)
        return SetResponse.success(res, RESPONSES.CREATED, {
            error: false,
            data: resData
          });
      } catch (error: any) {
          return SetResponse.success(res, RESPONSES.BADREQUEST, {
              error: true,
              msg: error.message
            });
      }
    };

  update = async (
      req: Request,
      res: Response
    ): Promise<Interfaces.PromiseResponse> => {
      try {
          const collectionId = req.params.collectionId
          const data = req.body
          const files:any = req.files
          const logo: any = files?.logo
          const banner: any = files?.banner
          if(logo){
            const logoUrl = await UploadImage(logo)
            data.logo = logoUrl
          }
          if(banner){
            const bannerUrl = await UploadImage(banner)
            data.banner = bannerUrl
          }
          const resData = await CollectionHelper.update(data, {collectionId})
          return SetResponse.success(res, RESPONSES.SUCCESS, {
              error: false,
              data : resData
            });
      } catch (error: any) {
          return SetResponse.success(res, RESPONSES.BADREQUEST, {
              error: true,
            });
      }
    };

  list = async (
        req: Request,
        res: Response
      ): Promise<Interfaces.PromiseResponse> => {
        try {
            const name = req.query.name ||''
            const offset = req.query.offset ||0
            const limit = req.query.limit ||10
            const resData = await CollectionHelper.list({name: name, offset: offset, limit: limit})
            return SetResponse.success(res, RESPONSES.SUCCESS, {
                error: false,
                data: resData
              });
        } catch (error: any) {
            return SetResponse.success(res, RESPONSES.BADREQUEST, {
                error: true,
              });
        }
      };

  getNftByUser = async (
        req: Request,
        res: Response
      ): Promise<Interfaces.PromiseResponse> => {
        try {
            console.log(req)
            return SetResponse.success(res, RESPONSES.SUCCESS, {
                error: false,
              });
        } catch (error: any) {
            return SetResponse.success(res, RESPONSES.BADREQUEST, {
                error: true,
              });
        }
      };

  getById = async (
        req: Request,
        res: Response
      ): Promise<Interfaces.PromiseResponse> => {
        try {
            const collectionId = req.params.collectionId
            const resData = await CollectionHelper.getCollectionById({collectionId})
            return SetResponse.success(res, RESPONSES.SUCCESS, {
                error: false,
                data: resData
              });
        } catch (error: any) {
            return SetResponse.success(res, RESPONSES.BADREQUEST, {
                error: true,
              });
        }
      }

  getByFeatured = async (
        req: Request,
        res: Response
      ): Promise<Interfaces.PromiseResponse> => {
        try {
          const name = req.query.name ||''
          const offset = req.query.offset ||0
          const limit = req.query.limit ||10
          const resData = await CollectionHelper.getCollectionByFeatured({name: name, offset: offset, limit: limit})
          return SetResponse.success(res, RESPONSES.SUCCESS, {
              error: false,
              data: resData
            });
        } catch (error: any) {
            return SetResponse.success(res, RESPONSES.BADREQUEST, {
                error: true,
              });
        }
      }

  getByFavourite = async (
        req: Request,
        res: Response
      ): Promise<Interfaces.PromiseResponse> => {
        try {
            const name = req.query.name ||''
            const offset = req.query.offset ||0
            const limit = req.query.limit ||10
            const resData = await CollectionHelper.getCollectionByFeatured({name: name, offset: offset, limit: limit})
            return SetResponse.success(res, RESPONSES.SUCCESS, {
                error: false,
                data: resData
              });
        } catch (error: any) {
            return SetResponse.success(res, RESPONSES.BADREQUEST, {
                error: true,
              });
        }
      }
  
  adminEdit = async (
        req: Request,
        res: Response
      ): Promise<Interfaces.PromiseResponse> => {
        try {
          const data = req.body
          const collectionId = req.params.collectionId
          const resNft = await CollectionHelper.update(data, {collectionId})
          return SetResponse.success(res, RESPONSES.SUCCESS, {
              error: false,
              data: resNft
            });
        } catch (error: any) {
          return SetResponse.success(res, RESPONSES.BADREQUEST, {
              error: true,
            });
        }
      };

  getByUser = async (
        req: Request,
        res: Response
      ): Promise<Interfaces.PromiseResponse> => {
        try {
          const walletAddress = req.params.walletAddress
          const user: any = await UserHelper.getOrCreate({walletAddress: walletAddress})
          console.log(user)
          const resCollections = await CollectionHelper.getCollectionByUser({userId: user.userId})
          console.log(user)
          return SetResponse.success(res, RESPONSES.SUCCESS, {
              error: false,
              data: resCollections
            });
        } catch (error: any) {
          return SetResponse.success(res, RESPONSES.BADREQUEST, {
              error: true,
            });
        }
      }; 

}

export default new Controller