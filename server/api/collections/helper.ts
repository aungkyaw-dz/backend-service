import CollectionModel from '../../models/collections.model';
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

  public async list({name, offset, limit}:{name: any, offset: any, limit: any}) {
        try {
            const res = await CollectionModel.findAll({
              where:{
                name: {
                  [Op.like]:[`%${name}%`]
                }
              },
              include: ['nfts', 'Creator'],
              offset: offset,
              limit: limit
            })
            return res
        } catch (err: any) {
            return {
                error: true,
                message: err.message,
            };
        }
    }

  public async getCollectionByUser({userId}: {userId: string}) {
        try {
            const res = await CollectionModel.findAll({
                where: {creator: userId},
                include: ['nfts', 'Creator']
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
          const res = await CollectionModel.findOne({
              where: {collectionId: collectionId},
              include: ['nfts', 'Creator']
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
            favourite: 1},
            include: ['nfts', 'Creator'],
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
            include: ['nfts', 'Creator'],
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