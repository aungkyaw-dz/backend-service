import UsersModel from '../../models/users.model';


class UserHelper{

  public async getOrCreate({ walletAddress }: { walletAddress: string }) {
    try {
        let user = await UsersModel.findOne({
            where: {
                walletAddress: walletAddress
            }
        })
        if(user){
          return user
        }
        user = await UsersModel.create({walletAddress})
        return user

    } catch (err: any) {
      return {
        error: true,
        message: err.message,
      };
    }
  }

  public async update(data: any, {walletAddress}: {walletAddress: string}) {
      try {
          const res = await UsersModel.update(data, {
              where: {walletAddress: walletAddress},
          })
          if(res){
            const user = await UsersModel.findOne({
              where: {walletAddress}
            })
            return user
          }
          return res
      } catch (err: any) {
        return {
          error: true,
          message: err.message,
        };
      }
    }

  public async getByWallet({walletAddress}: {walletAddress: string}) {
      try {
          const res = await UsersModel.findOne({
              where: {walletAddress: walletAddress},
          })
          if(res){
            const user = await UsersModel.findOne({
              where: {walletAddress},
              include: ['collections', 'ownedNfts', 'createdNfts']
            })
            return user
          }
          return res
      } catch (err: any) {
        return {
          error: true,
          message: err.message,
        };
      }
    }


}

export default new UserHelper();