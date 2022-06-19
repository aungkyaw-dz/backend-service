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

  public async update(data: any, {name}: {name: string}) {
      try {
        const res = await CollectionModel.update(data, {
            where: {name: name},
        })
        if(res){
          const collection = await CollectionModel.findOne({
            where: {name: name}
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

  public async list({name}:{name: any}) {
        try {
            const res = await CollectionModel.findAll({
              where:{
                name: {
                  [Op.like]:[`%${name}%`]
                }
              },
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
  
  public async getCollectionByName({name}: {name: string}) {
      try {
          const res = await CollectionModel.findOne({
              where: {name: name},
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

  public async getCollectionByFeatured() {
    try {
        const res = await CollectionModel.findOne({
            where: {featured: 1},
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

  public async getCollectionByFavourite() {
    try {
        const res = await CollectionModel.findOne({
            where: {favourite: 1},
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


}

export default new CollectionHelper();