import { Request, Response } from 'express';
import * as Interfaces from '../../config/interface';
import NftHelper from './helper';
import CollectionHelper from '../collections/helper';
import SetResponse, { RESPONSES } from '../../config/response'
import UserHelper from '../users/helper'
import { UploadImage } from '../../middleware/imagekitUpload';

class Controller {
  create = async (
      req: Request,
      res: Response
    ): Promise<Interfaces.PromiseResponse> => {
      try {
        const data = req.body
        let collectionData :any = await CollectionHelper.getCollectionByName({name: data.collectionName})
        const user:any = await UserHelper.getOrCreate({walletAddress: data.creator})
        data.creator = user.userId
        data.owner = user.userId
        const files:any = req.files
        const logo: any = files?.logo
        const logoUrl = await UploadImage(logo)
        data.logo = logoUrl
        if(!collectionData){
          collectionData = await CollectionHelper.create({name: data.collectionName, description: data.collectionDesc, creator: data.creator  })
        }
        data.collectionId = collectionData?.collectionId
        const resData = await NftHelper.create(data)
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
          const data = req.body
          const nftId = req.params.nftId

          const resData = await NftHelper.update(data, {nftId})
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

  list = async (
        req: Request,
        res: Response
      ): Promise<Interfaces.PromiseResponse> => {
        try {
            console.log(req)
            const resData = await NftHelper.list()
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
  
  getNftById = async (
    req: Request,
    res: Response
  ): Promise<Interfaces.PromiseResponse> => {
    try {
      const nftId = req.params.nftId
      const resData:any = await NftHelper.getNftById({nftId})
      const updateData:any = await  NftHelper.update({viewed: resData.viewed + 1}, {nftId})
      return SetResponse.success(res, RESPONSES.SUCCESS, {
          error: false,
          data: updateData
        });
    } catch (error: any) {
        return SetResponse.success(res, RESPONSES.BADREQUEST, {
            error: true,
          });
    }
  };

  getListByCollectionId = async (
      req: Request,
      res: Response
    ): Promise<Interfaces.PromiseResponse> => {
      try {
          const collectionId = req.params.collectionId
          const resData = await NftHelper.getListByCollection({collectionId})
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

  transfer = async (
        req: Request,
        res: Response
      ): Promise<Interfaces.PromiseResponse> => {
        try {
          const data = req.body
          const nftId = req.params.nftId
          let resNft:any = await NftHelper.getNftById({nftId})
          const user:any = await UserHelper.getOrCreate({walletAddress: data.user})
          const oldOwner = resNft.owner
          if(oldOwner === user.userId){
            const newOwner:any = await UserHelper.getOrCreate({walletAddress: data.transferTo})
            if(newOwner){
              resNft = await NftHelper.update({owner: newOwner.userId},{nftId})
            }else{
              resNft = await NftHelper.update({owner: data.transferTo},{nftId})
            }
          }
          else{
            resNft = "Only Owner can transfer the nft"
          }

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

  adminEdit = async (
        req: Request,
        res: Response
      ): Promise<Interfaces.PromiseResponse> => {
        try {
          const data = req.body
          const nftId = req.params.nftId
          const resNft = await NftHelper.update(data, {nftId})
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

}

export default new Controller