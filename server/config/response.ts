// import { RESPONSES } from '../constant/response';

class ResponseHelper {
    public success(response: any, status: number, responseData: any = {}) {
      return response.status(status).send(responseData);
    }
  
    public error(response: any, status: number, responseData: any = {}) {
      return response.status(status).send(responseData);
    }
  }
export const RESPONSES = {
SUCCESS: 200,
CREATED: 201,
ACCEPTED: 202,
NOCONTENT: 204,
BADREQUEST: 400,
UN_AUTHORIZED: 401,
FORBIDDEN: 403,
NOTFOUND: 404,
WRONG_DOCS: 406,
TIMEOUT: 408,
CONFLICT: 409,
TOOMANYREQ: 429,
INTERNALSERVER: 500,
BADGATEWAYS: 502,
SERVICEUNAVILABLE: 503,
GATEWAYTIMEOUT: 504,
};
export default new ResponseHelper();