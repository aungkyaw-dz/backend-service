import NFTsModel from '../../models/nfts.model';

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
        console.log(data, "here")
        const res = await NFTsModel.update(data, {
            where: {nftId: nftId},
        })
        console.log(res, "here")
        if(res){

          const updatedData = await NFTsModel.findOne({
            where: {nftId},
            include:['Owner', 'Creator']
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

  public async list() {
        try {
            const res = await NFTsModel.findAll()
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

  public async getNftByUser({userWallet}: {userWallet: string}) {
        try {
            const res = await NFTsModel.findAll({
                where: {owner: userWallet}
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