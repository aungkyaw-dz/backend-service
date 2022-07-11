import UsersModel from '../../models/users.model';
const { Op } = require("sequelize");

class AdminHelper{

  public async getAdminInfo({ walletAddress }: { walletAddress: string }) {
    try {
        let user:any = await UsersModel.findOne({
            where:{
              [Op.and]:[ 
                  {walletAddress: walletAddress},
                  {role_type: 2},
            ]}
        })
        console.log(user)
        if(user){
          return user
        }
        return {
          error: true
        }

    } catch (err: any) {
      return {
        error: true,
        message: err.message,
      };
    }
  }

}

export default new AdminHelper();