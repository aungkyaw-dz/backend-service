import { Request, Response } from 'express';
import * as Interfaces from '../../config/interface';
import NftHelper from './helper';
import CollectionHelper from '../collections/helper';
import SetResponse, { RESPONSES } from '../../config/response'
import UserHelper from '../users/helper'
// import { UploadImage } from '../../middleware/imagekitUpload';
import {  UploadFilesToAWS } from '../../middleware/aws-s3';
import { UploadFSToPinata, UploadFilesToPinata, UploadJsonToPinata } from '../../middleware/pinataUpload';
import NftModel from '../../models/nfts.model';
const { Op } = require("sequelize");
const {IMAGEKIT_ENDPOINT} = process.env
const fs = require('fs')
class Controller {
  create = async (
      req: Request,
      res: Response
    ): Promise<Interfaces.PromiseResponse> => {
      try {
        const data = req.body
        let files:any = req.files?.files
        fs.mkdirSync(`./uploadimages`)
        fs.mkdirSync(`./metadata`)
        if(!files.length){
          files = [files]
        }
        const imagekitList:any = {} 
        await Promise.all(
          files.map(async (file:any)=>{
            file.mv(`./uploadimages/${file.name}`)
            const fileUrl:any = await UploadFilesToAWS(file)
            let type = file.mimetype.split('/')[0]
            if(type=="application"){
                const ext = file.name.split('.').pop()
                switch (true){
                  case ["pdf"].includes(ext):
                    type = "pdf"
                    break;
                  case ['zip', 'rar'].includes(ext):
                    type= "zip"
                    break;
                  case ['doc','docx','doxc', 'dotx', 'xml','txt'].includes(ext):
                    type= "text"
                    break;
                  default:
                    type = 'application'
                    break;
                }
                // if(ext != 'pdf' && ext!= 'x-zip-compressed'){
                //   type= "text"
                // }
            }
            imagekitList[type] = {
              url: `${IMAGEKIT_ENDPOINT}/${file.name}`,
              name: file.name
            }
            return imagekitList
          })
        )

        const user:any = await UserHelper.getOrCreate({walletAddress: data.creator})
        data.creator = user.userId
        data.owner = user.userId
        let collectionData:any
        if(data.collectionId == "create"){
          collectionData = await CollectionHelper.create(
            {
              name: data.name, 
              description: data.description, 
              creator: data.creator,  
              owner: data.creator,
              facebook: data.facebook,
              discord: data.discord,
              logo: imagekitList['image'].url,
              totalNft: files.length
            })
          data.collectionId = collectionData?.collectionId
        }else{
          collectionData = await CollectionHelper.getCollectionById({collectionId: data.collectionId})
          data.collectionName = collectionData.name
        }
        const imageUrl:any = await UploadFSToPinata('uploadimages', data.name)
        let nftList:any[] = []
        let tires = ["image", "pdf", "text", "audio", "video", "zip"]
        console.log(imageUrl, "<<<<<here log")
        await Promise.all(
          tires.map(async(tire:string)=>{
            if(imagekitList[tire]){
              const metaData = {
                "name": data.name,
                "image":`https://gateway.pinata.cloud/ipfs/${imageUrl.IpfsHash}/${imagekitList[tire]?.name}`,
                "description": data.description
              };
              await fs.writeFileSync(`./metadata/${tire}`, JSON.stringify(metaData));
              return metaData; 
            }
            return {}
          })
        )
        const sourcePath = `metadata`
        const tokenUri:any = await UploadFSToPinata(sourcePath, data.name)
        let mintData:any = {}
        const updatedList =await Promise.all( tires.map(async (tire, index)=>{
            if(imagekitList[tire]){
              data.tokenUri = `https://gateway.pinata.cloud/ipfs/${tokenUri.IpfsHash}/${tire}`
              data.tokenId = index
              data.file = imagekitList[tire]?.url || ""
              data.fileType = tire
              data.status = "minted"
              const resData:any = await NftHelper.create(data)
              // const nftUsers:any = await NftHelper.addNftUser({userId: user.userId, nftId: resData.nftId, quantity: resData.quantity})
              mintData[tire] = {tokenUri: resData.tokenUri, nftId: resData.nftId}
            }
            
            return mintData
          })
          )
        fs.rmSync(`./uploadimages`, { recursive: true, force: true })
        fs.rmSync(`./metadata`, { recursive: true, force: true })
        return SetResponse.success(res, RESPONSES.CREATED, {
            error: false,
            collection: collectionData,
            mintData
          });
      } catch (error: any) {
          if (fs.existsSync('./uploadimages')) {
            fs.rmSync(`./uploadimages`, { recursive: true, force: true })
          }
          if (fs.existsSync('./metadata')) {
            fs.rmSync(`./metadata`, { recursive: true, force: true })
          }
          console.log(error)
          return SetResponse.success(res, RESPONSES.BADREQUEST, {
              error: true,
              msg: error.message
            });
      }
    };

  // bulkCreate = async (
  //     req: Request,
  //     res: Response
  //   ): Promise<Interfaces.PromiseResponse> => {
  //     try {
  //       const data = req.body
  //       let files:any = req.files?.files
  //       // data.categories = JSON.stringify(data.categories)
  //       fs.mkdirSync(`./uploadimages`)
  //       if(!files.length){
  //         files = [files]
  //       }
  //       files.map((file:any)=>{
  //         file.mv(`./uploadimages/${file.name}`)
  //       })
  //       const user:any = await UserHelper.getOrCreate({walletAddress: data.creator})
  //       data.creator = user.userId
  //       data.owner = user.userId
  //       if(data.collectionId == "create"){
  //         const collectionData:any = await CollectionHelper.create({name: data.collectionName, description: data.collectionDesc, creator: data.creator  })
  //         data.collectionId = collectionData?.collectionId
  //       }else{
  //         const collectionData:any = await CollectionHelper.getCollectionById({collectionId: data.collectionId})
  //         data.collectionName = collectionData.name
  //       }
  //       const imageUrl:any = await UploadFSToPinata('uploadimages', data.collectionName)
        
  //       fs.mkdirSync(`./${data.collectionName}`)
  //       let nftList:any[] = []
  //       files.map(async (file: any, index:any)=> {
  //         console.log(file, "<<<<<<<<<<<<<<<<<<<<<<")
  //         const logoUrl = await UploadImage(file)
  //         data.logo = logoUrl
  //         data.name = `${data.name}`
  //         const resData:any = await NftHelper.create(data)
  //         nftList.push(resData)
  //         const metaData = {
  //           "name": data.name,
  //           "image":`https://gateway.pinata.cloud/ipfs/${imageUrl.IpfsHash}/${file.name}`,
  //           "description": data.description
  //         }
  //         fs.writeFileSync(`./${data.collectionName}/${index+1}`, JSON.stringify(metaData))
  //       })
  //       const sourcePath = `${data.collectionName}`
  //       await new Promise(resolve => setTimeout(resolve, 5000));
  //       const tokenUri:any = await UploadFSToPinata(sourcePath, data.collectionName)
  //       let updateList:any[]=[]
  //       nftList.map(async (nft, index)=>{
  //         const updateData = {
  //           tokenUri: `https://gateway.pinata.cloud/ipfs/${tokenUri.IpfsHash}/${index+1}`,
  //           status: "READY"
  //         }
  //         const updatedNft = await NftHelper.update(updateData,{nftId: nft.nftId})
  //         updateList.push(updatedNft)
  //       })
  //       fs.rmSync(`./uploadimages`, { recursive: true, force: true })
  //       fs.rmSync(`./${data.collectionName}`, { recursive: true, force: true })
  //       return SetResponse.success(res, RESPONSES.CREATED, {
  //           error: false,
  //           data: updateList
  //         });
  //     } catch (error: any) {
  //         return SetResponse.success(res, RESPONSES.BADREQUEST, {
  //             error: true,
  //             msg: error.message
  //           });
  //     }
  //   };

  // asdf = async (
  //   req: Request,
  //   res: Response
  // ): Promise<Interfaces.PromiseResponse> => {
  //   try {
  //       const data = req.body
  //       const user:any = await UserHelper.getOrCreate({walletAddress: "0x6d9beA681678f75e6d1bc43012F4e7FB54a6E068"})
  //       console.log(user)
  //       const resData:any = await NftModel.findOne({
  //         where:{
  //           nftId: "1"
  //         },
  //       })
  //       const users = await resData.getOwners({ attributes: ['userId'] })
  //       return SetResponse.success(res, RESPONSES.SUCCESS, {
  //           error: false,
  //           data: users
  //         });
  //   } catch (error: any) {
  //     console.log(error)
  //     return SetResponse.success(res, RESPONSES.BADREQUEST, {
  //         error: true,
  //       });
  //   }
  // };
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

  updateOwner = async (
      req: Request,
      res: Response
    ): Promise<Interfaces.PromiseResponse> => {
      try {
          let data = req.body
          const nftId = req.params.nftId
          const user:any = await UserHelper.getOrCreate({walletAddress: data.owner})
          data.owner = user.userId
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

  // bulkUpdate = async(
  //   req: Request,
  //   res: Response
  // ): Promise<Interfaces.PromiseResponse> =>{
  //   try{
  //     const data = req.body
  //     let files:any = req.files?.files
  //     const collectionId = req.params.collectionId
  //     const collection = await CollectionHelper.getCollectionById({collectionId})
  //     if(!files.length){
  //       files = [files]
  //     }
  //     await Promise.all(
  //       files.map(async (file:any)=>{
  //         file.mv(`./uploadimages/${file.name}`)
  //         const fileUrl = await UploadFilesToAWS(file)
  //         let type = file.mimetype.split('/')[0]
  //         const pintaImageUrl:any = await UploadFilesToPinata(file, collection.name)
  //         const metaData = {
  //           "name": collection.nfts[0].name,
  //           "image":`https://gateway.pinata.cloud/ipfs/${pintaImageUrl.IpfsHash}`,
  //           "description": collection.nfts[0].description
  //         }
  //         const pinataMetadata:any = await UploadJsonToPinata(metaData, collection.name)
  //         const updateData = {
  //           tokenUri: `https://gateway.pinata.cloud/ipfs/${pinataMetadata.IpfsHash}`,
  //           file: `${IMAGEKIT_ENDPOINT}/${file.name}`,
  //         }
  //         if(type==="audio"){
  //           type= "video"
  //         }
  //         const resData:any = await NftHelper.updateByCollection(updateData, {collectionId: collection.collectionId, fileType: type})
  //       })
      
  //     )
  //     const nfts:any = await NftHelper.getListByCollection({collectionId: collection.collectionId})
  //     let mintData:any = {}
  //     await Promise.all(
  //       nfts.map((nft:any)=> {
  //         mintData[nft.fileType] = {tokenUri: nft.tokenUri, nftId: nft.nftId}
  //         return mintData
  //       })
  //     )

  //     return SetResponse.success(res, RESPONSES.SUCCESS, {
  //       error: false,
  //       mintData
  //     }); 
  //   }catch(error:any){
  //     return SetResponse.success(res, RESPONSES.BADREQUEST, {
  //       error: true,
  //     });
  //   }
  // }

  list = async (
        req: Request,
        res: Response
      ): Promise<Interfaces.PromiseResponse> => {
        try {
          const sortBy = req.query.sortBy ||''
          const offset = req.query.offset ||0
          const limit = req.query.limit ||10
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
          const resData = await NftHelper.list({sortBy: sortBy, query: query, offset: offset, limit: limit})
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
          const userWallet = req.params.userWallet
          const query = req.query
          const user:any = await UserHelper.getByWallet({walletAddress:userWallet})
          const nftRes = await NftHelper.getNftByUser({userId: user.userId, query: query })

          return SetResponse.success(res, RESPONSES.SUCCESS, {
              error: false,
              data: nftRes
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

  getAllCategories = async (
    req: Request,
    res: Response
  ): Promise<Interfaces.PromiseResponse> => {
    try {
      console.log(req)
      const categories:any = await NftHelper.getAllCategories()
      let list:any[] = []
      categories.map((category)=> {
        list.push(category.categories)
      })
      console.log(list)
      return SetResponse.success(res, RESPONSES.SUCCESS, {
          error: false,
          data: categories
        });
    } catch (error: any) {
      return SetResponse.success(res, RESPONSES.BADREQUEST, {
          error: true,
          message: error.message
        });
    }
  };

}

export default new Controller