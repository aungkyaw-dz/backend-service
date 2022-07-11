import { Request, Response } from 'express';
import * as Interfaces from '../../config/interface';
import AdminHelper from './helper';
import SetResponse, { RESPONSES } from '../../config/response'
import { UploadImage } from '../../middleware/imagekitUpload';
import UserHelper from '../users/helper'
import  TokenHandler  from '../../middleware/jwt';
class Controller {
  adminLogin = async (
    req: Request,
    res: Response
  ): Promise<Interfaces.PromiseResponse> => {
    try {
      const { walletAddress, password } = req.body;
      const userInfo: any = await AdminHelper.getAdminInfo({
        walletAddress: walletAddress,
      });
      if (userInfo.error) {
        return SetResponse.error(res, RESPONSES.BADREQUEST, {
          message: "Please connect with Admin wallet",
          error: userInfo.error,
        });
      }
      if(userInfo?.role_type!=2){
        return SetResponse.error(res, RESPONSES.BADREQUEST, {
          message: "You are not Admin",
          error: userInfo.error,
        });
      }
      
      const userId = userInfo.userId;
      const token = await TokenHandler.generateToken(userId.toString());

      // let data = await redisHelper.getString(
      //   `jwt_token_${userId}`
      // );
      // console.log('REDIS DATA :: ', data);

      // Generating fresh access token for auth

      return SetResponse.success(res, RESPONSES.SUCCESS, {
        data: {
          accessToken: token.data,
          refreshToken: token.data,
          userId,
        },
        error: false,
      });
    } catch (error: any) {
      console.log('admin login error:: ', error);
      return SetResponse.error(res, error.status | 400, {
        message: error.message,
        error: true,
      });
    }
  };
}

export default new Controller