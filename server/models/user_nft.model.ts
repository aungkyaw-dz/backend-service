import { DataTypes } from 'sequelize';
import sequelize from '../config/db_connection';
import UsersModel from './users.model';
import NftModel from './nfts.model';
const UserNftModel = sequelize.define(
  'user_nfts',
  {
    quantity: { type: DataTypes.INTEGER(), defaultValue: 1 },
  },
  { timestamps: false }
);


UsersModel.belongsToMany(NftModel, {as:'Nfts', through: 'user_nfts'});
NftModel.belongsToMany(UsersModel, {as:'Owners', through: 'user_nfts'});
UsersModel.hasMany(UserNftModel);
NftModel.hasMany(UserNftModel);
UserNftModel.belongsTo(UsersModel);
UserNftModel.belongsTo(NftModel);

export default UserNftModel