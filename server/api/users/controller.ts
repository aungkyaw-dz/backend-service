import { Request, Response } from 'express';
import * as Interfaces from '../../config/interface';
import UserHelper from './helper';
import SetResponse, { RESPONSES } from '../../config/response'
// import { UploadImage } from '../../middleware/imagekitUpload';
import {  UploadFilesToAWS } from '../../middleware/aws-s3';

class Controller {
  getUserOrCreat = async (
      req: Request,
      res: Response
    ): Promise<Interfaces.PromiseResponse> => {
      try {
          const {walletAddress} = req.body
          const resData = await UserHelper.getOrCreate({walletAddress})
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

  updateUser = async (
      req: Request,
      res: Response
    ): Promise<Interfaces.PromiseResponse> => {
      try {
          const walletAddress = req.params.walletAddress
          const data = req.body
          const files:any = req.files
          const profileImage: any = files?.profileImage
          if(profileImage){
            const profileUrl = await UploadFilesToAWS(profileImage)
            data.profileImage = profileUrl
          }
          // if(banner){
          //   const bannerUrl = await UploadImage(banner)
          //   data.banner = bannerUrl
          // }
          const resData = await UserHelper.update(data, {walletAddress})
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

  getUser = async (
      req: Request,
      res: Response
    ): Promise<Interfaces.PromiseResponse> => {
      try {
          const walletAddress = req.params.walletAddress
          const resData = await UserHelper.getByWallet({walletAddress})
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
    


}

export default new Controller