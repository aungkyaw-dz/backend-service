import { Request, Response } from 'express';
import * as Interfaces from '../../config/interface';
import CollectionHelper from './helper';
import SetResponse, { RESPONSES } from '../../config/response'
import { UploadImage } from '../../middleware/imagekitUpload';
import UserHelper from '../users/helper'
import ListHelper from '../lists/helper'
const { Op } = require("sequelize");

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
        data.owner = user
        const resData = await CollectionHelper.create(data)
        return SetResponse.success(res, RESPONSES.CREATED, {
            error: false,
            data: resData
          });
      } catch (error: any) {
          return SetResponse.error(res, RESPONSES.BADREQUEST, {
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
          const walletAddress = data.owner
          if(walletAddress){
            const user:any = await UserHelper.getOrCreate({walletAddress: walletAddress})
            data.owner = user?.userId
          }
          if(logo){
            const logoUrl = await UploadImage(logo)
            data.logo = logoUrl
          }
          if(banner){
            const bannerUrl = await UploadImage(banner)
            data.banner = bannerUrl
          }
          const resData = await CollectionHelper.update(data, {collectionId})
          console.log(resData)
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
            const sortBy = req.query.sortBy ||''
            const offset = Number(req.query.offset) ||0
            const limit = Number(req.query.limit) ||10
            let query:any = {}
            if(req.query.status){
              query.status = req.query.status
            }
            if(req.query.price){
              query.price = req.query.price
            }
            if(req.query.item){
              query.item = req.query.item
            }
            if(req.query.categories){
              query.categories = {
                [Op.like]: `%${req.query.categories}%`
              }
            }
            if(req.query.chain){
              query.chain = req.query.chain
            }
            const resData = await CollectionHelper.list({sortBy: sortBy, query: query, offset: offset, limit: limit})
            return SetResponse.success(res, RESPONSES.SUCCESS, {
                error: false,
                data: resData
              });
        } catch (error: any) {
            return SetResponse.error(res, RESPONSES.BADREQUEST, {
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
            const collectionId = req.params.collectionId
            const resData = await CollectionHelper.getCollectionById({collectionId})
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
            return SetResponse.error(res, RESPONSES.BADREQUEST, {
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
            const resData = await CollectionHelper.getCollectionByFavourite({name: name, offset: offset, limit: limit})

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
          return SetResponse.error(res, RESPONSES.BADREQUEST, {
              error: true,
            });
        }
      };

  getByUser = async (
        req: Request,
        res: Response
      ): Promise<Interfaces.PromiseResponse> => {
        try {
          const sortBy = req.query.sortBy ||''
          const offset = Number(req.query.offset) ||0
          const limit = Number(req.query.limit) ||10
          let query:any = {}
          if(req.query.status){
            query.status = req.query.status
          }
          if(req.query.price){
            query.price = req.query.price
          }
          if(req.query.item){
            query.item = req.query.item
          }
          if(req.query.categories){
            query.categories = {
              [Op.like]: `%${req.query.categories}%`
            }
          }
          if(req.query.chain){
            query.chain = req.query.chain
          }
          const walletAddress = req.params.walletAddress
          const user: any = await UserHelper.getOrCreate({walletAddress: walletAddress})
          const resCollections:any = await CollectionHelper.getCollectionByUser({userId: user.userId, sortBy: sortBy, query: query, limit: limit, offset: offset})
          return SetResponse.success(res, RESPONSES.SUCCESS, {
              error: false,
              data: resCollections
            });
        } catch (error: any) {
          console.log(error)
          return SetResponse.error(res, RESPONSES.BADREQUEST, {
              error: true,
            });
        }
      }; 

  addList = async (
        req: Request,
        res: Response
      ): Promise<Interfaces.PromiseResponse> => {
        try {
          const collectionId = req.params.collectionId
          let data = req.body
          const walletAddress = data.walletAddress
          const user: any = await UserHelper.getOrCreate({walletAddress: walletAddress})
          data.creator= user.userId
          data.collectionId= collectionId
          const resCollections:any = await ListHelper.create(data)
          return SetResponse.success(res, RESPONSES.SUCCESS, {
              error: false,
              data: resCollections
            });
        } catch (error: any) {
          console.log(error)
          return SetResponse.error(res, RESPONSES.BADREQUEST, {
              error: true,
            });
        }
      }; 

}

export default new Controller