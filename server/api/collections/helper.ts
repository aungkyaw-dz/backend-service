import CollectionModel from '../../models/collections.model';
import ListModel from '../../models/lists.model';
import NftModel from '../../models/nfts.model';
const { Op } = require("sequelize");
class CollectionHelper{

  public async create(data:any) {
    try {
        const res = await CollectionModel.create(data)
        return res
    } catch (err: any) {
      return {
        error: true,
        message: err.message,
      };
    }
  }

  public async update(data: any, {collectionId}: {collectionId: string}) {
      try {
        const res = await CollectionModel.update(data, {
            where: {collectionId: collectionId},
        })
        if(res){
          const collection = await CollectionModel.findOne({
            where: {collectionId: collectionId}
          })
          return collection
        }
        return res
          
      } catch (err: any) {
        return {
          error: true,
          message: err.message,
        };
      }
    }

  public async list({sortBy ,query, offset, limit}:{sortBy:any, query: any,offset: any, limit: any}) {
        try {
            const key = sortBy ? sortBy : "createdAt"
            const res = await CollectionModel.findAll({
              include: [{model: NftModel, as: 'nfts', where: [query],required: true}, 'Creator', 'Owner'],
              offset: offset,
              limit: limit,
              order: [
                [key, 'DESC']
              ]
            })
            return res
        } catch (err: any) {
            return {
                error: true,
                message: err.message,
            };
        }
    }

  public async getCollectionByUser({userId, sortBy ,query,limit, offset}: {userId: string, sortBy:any, query: any,limit:number, offset:number}) {
        try {
            const key = sortBy ? sortBy : "createdAt"
            const res = await CollectionModel.findAll({
                where: {owner: userId},
                include: [{model: NftModel, as: 'nfts', where: [query],required: true}, 'Creator', 'Owner'],
                limit: limit,
                offset: offset,
                order: [
                  [key, 'DESC']
                ]
            })
            return res
        } catch (err: any) {
            return {
                error: true,
                message: err.message,
            };
        }
    }
  
  public async getCollectionById({collectionId}: {collectionId: string}) {
      try {
          const res:any = await CollectionModel.findOne({
              where: {collectionId: collectionId},
              include: [
                {model: NftModel, as: 'nfts', include: ['Owner']},
                'Creator', 
                'Owner', 
                {model: ListModel, as: 'listedItems', include: ['Creator']}
              ],
              order: [['listedItems', 'status', 'asc']]
          })
          return res
      } catch (err: any) {
          return {
              error: true,
              message: err.message,
          };
      }
  }

  public async getCollectionByFeatured({name,offset, limit}:{name:any, offset: any, limit: any}) {
    try {
        const res = await CollectionModel.findAll({
          where: {
            name: {
              [Op.like]:[`%${name}%`]
            },
            featured: 1},
            include: [{model: NftModel, as: 'nfts', where: {status: "MINTED"},required: false}, 'Creator', 'Owner'],
            offset: offset,
            limit: limit,
        })
        return res
    } catch (err: any) {
        return {
            error: true,
            message: err.message,
        };
    }
  }

  public async getCollectionByFavourite({name,offset, limit}:{name:any, offset: any, limit: any}) {
    try {
        const res = await CollectionModel.findAll({
            where: {
              name: {
                [Op.like]:[`%${name}%`]
              },
              favourite: 1},
              include: [{model: NftModel, as: 'nfts', where: {status: "MINTED"},required: false}, 'Creator', 'Owner'],
            offset: offset,
            limit: limit,
        })
        return res
    } catch (err: any) {
        return {
            error: true,
            message: err.message,
        };
    }
  }


}

export default new CollectionHelper();