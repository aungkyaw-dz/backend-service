import ListModel from '../../models/lists.model';
import NftModel from '../../models/nfts.model';
const { Op } = require("sequelize");
class CollectionHelper{

  public async create(data:any) {
    try {
        console.log(data)
        const res = await ListModel.create(data)
        return res
    } catch (err: any) {
      return {
        error: true,
        message: err.message,
      };
    }
  }

  public async update(data: any, {listId}: {listId: string}) {
      try {
        const res = await ListModel.update(data, {
            where: {listId: listId},
        })
        if(res){
          const list = await ListModel.findOne({
            where: {listId: listId}
          })
          return list
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
            const res = await ListModel.findAll({
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

  public async getListById({listId}: {listId: string}) {
      try {
          const res:any = await ListModel.findOne({
              where: {collectionId: listId},
              include: [{model: NftModel, as: 'nfts', include: ['Owner']}, 'Creator', 'Owner'],
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