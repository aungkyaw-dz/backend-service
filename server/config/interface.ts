export interface PromiseResponse {
    error: boolean;
    message: string;
    status: number;
    data?: any;
    list?: any;
  }
  
export interface AuthTokenResponseType {
    iat: number;
    exp: number;
    aud: string;
    iss: string;
  }
  
export interface TokenResponse {
    iat: number;
    exp: number;
    aud: string;
    iss: string;
  }
  
export interface UserSignup {
    email: string;
    password: string;
    username: string;
    fullname: string;
  }
export interface UserRole {
    email: string;
    isFeatured: boolean;
    bio: string;
    fullname: string;
    username: string;
    password: string;
    role_type: number;
    profileImage: string;
    coverImage: string;
    brandId?: string;
    subTitle?: string;
    showcaseImage?: string;
  }
export interface Role {
    role_name: string;
  }
export interface UserSignin {
    email: string;
    password: string;
  }
  
export interface UserUpdate {
    notification_email: string;
    username: string;
    fullname: string;
    bio: string;
    profileImage: string;
    coverImage: string;
  }
  
export interface BrandUpdate {
    bio: string,
    fullname: string,
    coverImage: string,
    profileImage: string,
    isFeatured: boolean,
    showcaseImage: string
  }
  
export interface ArtistUpdate {
    bio: string,
    fullname: string,
    coverImage: string,
    profileImage: string,
    brandId: string
    isFeatured: boolean,
    showcaseImage: string
  }
  
export interface AddSale {
    nftId: number;
    userId: string;
    auctionExpireDate: string;
    price: string;
    nftType: string;
    minBidCost: string;
    initialBidPrice:string;
  }