import NFTsModel from '../../models/nfts.model';
const { Op } = require("sequelize");

class NftHelper{

  public async create(data:any) {
    try {
      const res = await NFTsModel.create(data)
      return res
    } catch (err: any) {
      return {
        error: true,
        message: err.message,
      };
    }
  }

  public async update(data: any, {nftId}: {nftId: string}) {
      try {
        const res = await NFTsModel.update(data, {
            where: {nftId: nftId},
        })
        if(res){
          const updatedData = await NFTsModel.findOne({
            where: {nftId},
            include:['Owner', 'Creator'],
            raw: true
          })

          return updatedData
        }
        return res
          
      } catch (err: any) {
        return {
          error: true,
          message: err.message,
        };
      }
    }
  
  public async updateByCollection(data: any, {collectionId, fileType}: {collectionId: string, fileType: string}) {
      try {
        const res = await NFTsModel.update(data, {
            where: {
              collectionId: collectionId,
              fileType: fileType
            },
        })
        if(res){
          const updatedData = await NFTsModel.findOne({
            where: {collectionId: collectionId, fileType: fileType},
            include:['Owner', 'Creator'],
            raw: true
          })

          return updatedData
        }
        return res
          
      } catch (err: any) {
        return {
          error: true,
          message: err.message,
        };
      }
    }

  public async list({sortBy ,query,offset, limit}:{sortBy:any, query: any,offset: any, limit: any}) {
        try {
          const key = sortBy ? sortBy : "createdAt"
          console.log(query)
          const res = await NFTsModel.findAll({
            where: [query],
            offset: offset,
            limit: limit,
            include:['Owner', 'Creator'],
            order: [
              [key, "DESC"] 
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
  public async getNftById({nftId}: {nftId: string}) {
      try {
          const res = await NFTsModel.findOne(
              {
                where: {
                  nftId: nftId
                },
                include: ['Owner'],
              }
            )
          return res
      } catch (err: any) {
          return {
              error: true,
              message: err.message,
          };
      }
  }
  public async getListByCollection({collectionId}: {collectionId: string}) {
      try {
          const res = await NFTsModel.findAll(
            {
              where: {
                collectionId: collectionId
              }
            }
          )
          return res
      } catch (err: any) {
          return {
              error: true,
              message: err.message,
          };
      }
  }

  public async getNftByUser({userId, query}: {userId: string, query: any}) {
        try {
            query.owner= userId
            console.log(query)
            const res = await NFTsModel.findAll({
                where: [
                  query,
                  {tokenUri: {
                    [Op.ne]: ""
                  }}
                 ],
                include:['Owner', 'Creator', 'Collection']

            })
            console.log(res)
            return res
        } catch (err: any) {
            return {
                error: true,
                message: err.message,
            };
        }
    }

  public async getAllCategories() {
    try {
        const res = await NFTsModel.findAll({
          attributes: ["categories"],
          group: 'categories',
          raw: true
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

export default new NftHelper();