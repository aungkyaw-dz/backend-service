import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import CONFIG from '../config/env';
import * as Interfaces from '../config/interface';
import SetResponse, { RESPONSES } from '../config/response'
import {MESSAGES} from '../config/message'
// import dbUserService from '../services/db.user.service';
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
    userRole?: string;
  }
}

export class TokenHandler {
  generateToken = async (
    userId: string
  ): Promise<Interfaces.PromiseResponse> => {
    try {
      console.log(!CONFIG.JWT.ACCESS_SECRET)
      if (!CONFIG.JWT.ACCESS_SECRET) {
        throw { message: MESSAGES.JWT.SECRET_ERROR };
      }

      const payload = {
        // aud: userId
      };

      const secret = CONFIG.JWT.ACCESS_SECRET;
      const options = {
        expiresIn: CONFIG.JWT.EXPIRES_IN,
        issuer: CONFIG.JWT.ISSUER,
        audience: userId,
      };

      const token = jwt.sign(payload, secret, options);
      console.log('JWT Helper - Generating Token');
      if (!token)
        throw {
          message: MESSAGES.JWT.GENERATE_ERROR,
          status: RESPONSES.INTERNALSERVER,
        };

      return {
        data: token,
        error: false,
        message: MESSAGES.JWT.SUCCESS,
        status: RESPONSES.SUCCESS,
      };
    } catch (error: any) {
      console.log(error, 'JWT Helper - Error while generating token');

      return {
        error: true,
        status: error.status ? error.status : RESPONSES.BADREQUEST,
        message: error.message,
      };
    }
  };
  verifyTokenUser = (req: Request, res: Response) => {
    const token = req.header('Authorization');
    if (!token)
      return SetResponse.error(res, RESPONSES.UN_AUTHORIZED, {
        message: MESSAGES.JWT.ERROR,
        error: true,
      });
    try {
      if (!CONFIG.JWT.ACCESS_SECRET) {
        throw { message: MESSAGES.JWT.SECRET_ERROR };
      }

      const { aud } = jwt.verify(
        token,
        CONFIG.JWT.ACCESS_SECRET
      ) as Interfaces.TokenResponse;
      req.userId = aud;
      return SetResponse.success(res, RESPONSES.SUCCESS, {
        message: 'Token verified Success',
        error: false,
        status: true,
      });
      //return next();
    } catch (error: any) {
      console.log(error, 'JWT Helper - Error while verifying token user');

      return SetResponse.success(res, 401, {
        message: 'Token verified Failed',
        error: true,
        status: false,
      });
    }
  };
  verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    // console.log(token,"token")
    if (!token)
      return SetResponse.error(res, RESPONSES.UN_AUTHORIZED, {
        message: MESSAGES.JWT.ERROR,
        error: true,
      });
    try {
      if (!CONFIG.JWT.ACCESS_SECRET) {
        throw { message: MESSAGES.JWT.SECRET_ERROR };
      }
      const { aud } = jwt.verify(
        token,
        CONFIG.JWT.ACCESS_SECRET
      ) as Interfaces.AuthTokenResponseType;
      req.userId = aud;
      return next();
    } catch (error: any) {
      console.log(error, 'JWT Helper - Error while verifying verify token');

      return SetResponse.error(res, RESPONSES.UN_AUTHORIZED, {
        message: MESSAGES.JWT.EXPIRED,
        error: true,
      });
    }
  };
  generateRefreshToken = async (
    userId: string
  ): Promise<Interfaces.PromiseResponse> => {
    try {
      if (!CONFIG.JWT.REFRESH_TOKEN) {
        throw { message: MESSAGES.JWT.SECRET_ERROR };
      }
      const payload = {
        // aud: userId
      };
      const secret = CONFIG.JWT.REFRESH_TOKEN;
      const options = {
        expiresIn: '1m', // One month expiry
        issuer: CONFIG.JWT.ISSUER,
        audience: userId,
      };
      const token = jwt.sign(payload, secret, options);
      console.log('JWT Helper - Generating RefreshToken');

      if (!token)
        throw {
          message: MESSAGES.JWT.GENERATE_ERROR,
          status: RESPONSES.INTERNALSERVER,
        };
      return {
        data: token,
        error: false,
        message: MESSAGES.JWT.SUCCESS,
        status: RESPONSES.SUCCESS,
      };
    } catch (error: any) {
      console.log(error, 'JWT Helper - Error while generation refresh token');

      return {
        error: true,
        status: error.status ? error.status : RESPONSES.BADREQUEST,
        message: error.message,
      };
    }
  };
  verifyRefreshToken = async (
    refreshToken: string
  ): Promise<Interfaces.PromiseResponse> => {
    try {
      if (!CONFIG.JWT.REFRESH_TOKEN) {
        throw { message: MESSAGES.JWT.SECRET_ERROR };
      }

      if (!refreshToken)
        throw {
          message: MESSAGES.JWT.ERROR,
          status: RESPONSES.UN_AUTHORIZED,
        };

      const { aud } = jwt.verify(
        refreshToken,
        CONFIG.JWT.REFRESH_TOKEN
      ) as Interfaces.AuthTokenResponseType;
      return {
        data: aud,
        error: false,
        message: MESSAGES.JWT.SUCCESS,
        status: RESPONSES.SUCCESS,
      };
    } catch (error: any) {
      console.log(error, 'JWT Helper - Error while verifying refresh token');

      return {
        error: true,
        status: error.status ? error.status : RESPONSES.UN_AUTHORIZED,
        message: error.message,
      };
    }
  };

  /**
   * Lambda Authorizer function parse jwttoken, if valid, extract the userId and pass
   * to this function in headers
   * @param req
   * @param res
   * @param next
   * @returns
   */

  lambdaAuthorizer = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.header('userid');
    const userRole = req.header('role');
    if (!userId)
      return SetResponse.error(res, RESPONSES.UN_AUTHORIZED, {
        message: MESSAGES.JWT.ERROR,
        error: true,
      });
    req.userId = userId;
    req.userRole = userRole;
    return next();
  };
}

export default new TokenHandler();
