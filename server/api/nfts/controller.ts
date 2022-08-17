import { Request, Response } from 'express';
import * as Interfaces from '../../config/interface';
import NftHelper from './helper';
import CollectionHelper from '../collections/helper';
import SetResponse, { RESPONSES } from '../../config/response'
import UserHelper from '../users/helper'
import { UploadImage } from '../../middleware/imagekitUpload';
import {  UploadFilesToAWS } from '../../middleware/aws-s3';
import { UploadFSToPinata, UploadFilesToPinata, UploadJsonToPinata } from '../../middleware/pinataUpload';
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
        if(!files.length){
          files = [files]
        }
        const imagekitList:any = {} 
        await Promise.all(
          files.map(async (file:any)=>{
            file.mv(`./uploadimages/${file.name}`)
            const fileUrl:any = await UploadFilesToAWS(file)
            let type = file.mimetype.split('/')[0]
            if(type=="audio"){
              type = "video"
            }
            imagekitList[type] = {
              url: `${IMAGEKIT_ENDPOINT}/${file.name}`,
              name: file.name
            }
            console.log(imagekitList)
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
              name: data.collectionName, 
              description: data.collectionDesc, 
              creator: data.creator,  
              owner: data.creator,
              facebook: data.facebook,
              discord: data.discord  
            })
          data.collectionId = collectionData?.collectionId
        }else{
          collectionData = await CollectionHelper.getCollectionById({collectionId: data.collectionId})
          data.collectionName = collectionData.name
        }
        const imageUrl:any = await UploadFSToPinata('uploadimages', data.collectionName)
        
        fs.mkdirSync(`./${data.collectionName}`)
        let nftList:any[] = []
        let tires = ["image", "application", "text", "video"]

        await Promise.all(
          tires.map(async(tire:string)=>{
            const metaData = {
              "name": data.name,
              "image":`https://gateway.pinata.cloud/ipfs/${imageUrl.IpfsHash}/${imagekitList[tire]?.name}`,
              "description": data.description
            };
            await fs.writeFileSync(`./${data.collectionName}/${tire}`, JSON.stringify(metaData));
            return metaData; 
          })
        )
        const sourcePath = `${data.collectionName}`
        const tokenUri:any = await UploadFSToPinata(sourcePath, data.collectionName)
        let mintData:any = {}
        const updatedList =await Promise.all( tires.map(async (tire, index)=>{
            data.tokenUri = `https://gateway.pinata.cloud/ipfs/${tokenUri.IpfsHash}/${tire}`
            data.tokenId = index
            data.file = imagekitList[tire]?.url || ""
            data.fileType = tire
            data.status = "minted"
            const resData:any = await NftHelper.create(data)
            mintData[tire] = {tokenUri: resData.tokenUri, nftId: resData.nftId}
            return mintData
          })
          )

        fs.rmSync(`./uploadimages`, { recursive: true, force: true })
        fs.rmSync(`./${data.collectionName}`, { recursive: true, force: true })

        return SetResponse.success(res, RESPONSES.CREATED, {
            error: false,
            collection: collectionData,
            mintData
          });
      } catch (error: any) {
          return SetResponse.success(res, RESPONSES.BADREQUEST, {
              error: true,
              msg: error.message
            });
      }
    };

  bulkCreate = async (
      req: Request,
      res: Response
    ): Promise<Interfaces.PromiseResponse> => {
      try {
        const data = req.body
        let files:any = req.files?.files
        // data.categories = JSON.stringify(data.categories)
        fs.mkdirSync(`./uploadimages`)
        if(!files.length){
          files = [files]
        }
        files.map((file:any)=>{
          file.mv(`./uploadimages/${file.name}`)
        })
        const user:any = await UserHelper.getOrCreate({walletAddress: data.creator})
        data.creator = user.userId
        data.owner = user.userId
        if(data.collectionId == "create"){
          const collectionData:any = await CollectionHelper.create({name: data.collectionName, description: data.collectionDesc, creator: data.creator  })
          data.collectionId = collectionData?.collectionId
        }else{
          const collectionData:any = await CollectionHelper.getCollectionById({collectionId: data.collectionId})
          data.collectionName = collectionData.name
        }
        const imageUrl:any = await UploadFSToPinata('uploadimages', data.collectionName)
        
        fs.mkdirSync(`./${data.collectionName}`)
        let nftList:any[] = []
        files.map(async (file: any, index:any)=> {
          console.log(file, "<<<<<<<<<<<<<<<<<<<<<<")
          const logoUrl = await UploadImage(file)
          data.logo = logoUrl
          data.name = `${data.name}`
          const resData:any = await NftHelper.create(data)
          nftList.push(resData)
          const metaData = {
            "name": data.name,
            "image":`https://gateway.pinata.cloud/ipfs/${imageUrl.IpfsHash}/${file.name}`,
            "description": data.description
          }
          fs.writeFileSync(`./${data.collectionName}/${index+1}`, JSON.stringify(metaData))
        })
        const sourcePath = `${data.collectionName}`
        await new Promise(resolve => setTimeout(resolve, 5000));
        const tokenUri:any = await UploadFSToPinata(sourcePath, data.collectionName)
        let updateList:any[]=[]
        nftList.map(async (nft, index)=>{
          const updateData = {
            tokenUri: `https://gateway.pinata.cloud/ipfs/${tokenUri.IpfsHash}/${index+1}`,
            status: "READY"
          }
          const updatedNft = await NftHelper.update(updateData,{nftId: nft.nftId})
          updateList.push(updatedNft)
        })
        fs.rmSync(`./uploadimages`, { recursive: true, force: true })
        fs.rmSync(`./${data.collectionName}`, { recursive: true, force: true })
        return SetResponse.success(res, RESPONSES.CREATED, {
            error: false,
            data: updateList
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

  bulkUpdate = async(
    req: Request,
    res: Response
  ): Promise<Interfaces.PromiseResponse> =>{
    try{
      const data = req.body
      let files:any = req.files?.files
      const collectionId = req.params.collectionId
      const collection = await CollectionHelper.getCollectionById({collectionId})
      if(!files.length){
        files = [files]
      }
      await Promise.all(
        files.map(async (file:any)=>{
          file.mv(`./uploadimages/${file.name}`)
          const fileUrl = await UploadFilesToAWS(file)
          let type = file.mimetype.split('/')[0]
          const pintaImageUrl:any = await UploadFilesToPinata(file, collection.name)
          const metaData = {
            "name": collection.nfts[0].name,
            "image":`https://gateway.pinata.cloud/ipfs/${pintaImageUrl.IpfsHash}`,
            "description": collection.nfts[0].description
          }
          const pinataMetadata:any = await UploadJsonToPinata(metaData, collection.name)
          const updateData = {
            tokenUri: `https://gateway.pinata.cloud/ipfs/${pinataMetadata.IpfsHash}`,
            file: `${IMAGEKIT_ENDPOINT}/${file.name}`,
          }
          if(type==="audio"){
            type= "video"
          }
          const updatedNft = await NftHelper.updateByCollection(updateData, {collectionId: collection.collectionId, fileType: type})
        })
      )
      const updateList = data.updateList
      let updatedList: any[] = []
      if(updateList.length > 0){
        updateList.map(async (updateData:any)=>{
          const resData = await NftHelper.update(updateData, {nftId: updateData.nftId})
          updatedList = [...updatedList, resData]
        })
      }
      return SetResponse.success(res, RESPONSES.SUCCESS, {
        error: false,
        data: updatedList
      }); 
    }catch(error:any){
      return SetResponse.success(res, RESPONSES.BADREQUEST, {
        error: true,
      });
    }
  }

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
        console.log(typeof(category.categories)=='string', "here")
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