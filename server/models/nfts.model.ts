import { DataTypes } from 'sequelize';
import sequelize from '../config/db_connection';
import CollectionsModel from './collections.model';
import UsersModel from './users.model';

const NftModel = sequelize.define(
  'nfts',
  {
    nftId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    collectionId: { type: DataTypes.INTEGER(), allowNull: false },
    nftAddress: { type: DataTypes.STRING(50), allowNull: true },
    name: { type: DataTypes.STRING(50), allowNull: true },
    fileType: { type: DataTypes.STRING(50), defaultValue: 'image' },
    description: { type: DataTypes.TEXT(), defaultValue: '' },
    tokenUri: { type: DataTypes.STRING(), allowNull: true },
    nftType: {
      type: DataTypes.ENUM,
      values: ['FREE', 'SALE', 'AUCTION', 'RAFFLE', 'MB1', 'MB2'],
      defaultValue: 'SALE',
    },
    price: { type: DataTypes.DOUBLE, allowNull: true, defaultValue: 0 },
    currency: {
      type: DataTypes.ENUM,
      values: ['USD', 'ETH'],
      defaultValue: 'USD',
    },
    status: {
      type: DataTypes.ENUM(),
      values: ['PENDING','UPDATING', 'READY', 'MINTED', 'FAILED'],
      defaultValue: 'PENDING',
    },
    tokenId: { type: DataTypes.INTEGER(), defaultValue: 0 },
    quantity: { type: DataTypes.INTEGER(), defaultValue: 1 },
    owner: { type: DataTypes.STRING(200), allowNull: true },
    creator: { type: DataTypes.STRING(200), allowNull: true },
    txid: { type: DataTypes.STRING(), allowNull: true },
    viewed: { type: DataTypes.INTEGER(), defaultValue: 0 },
    file: { type: DataTypes.STRING(), allowNull: true },
    banner: { type: DataTypes.STRING(), allowNull: true },
    active: { type: DataTypes.BOOLEAN, defaultValue: 1 },
    featured: { type: DataTypes.BOOLEAN, defaultValue: 0 },
    favourite: { type: DataTypes.BOOLEAN, defaultValue: 0 },
    link: { type: DataTypes.STRING(), allowNull: true },
    item: {
      type: DataTypes.ENUM(),
      values: ['SINGLE', 'BUNDLE'],
      defaultValue: 'SINGLE',
    },
    chain: {
      type: DataTypes.ENUM(),
      values: ['POLYGON'],
      defaultValue: 'POLYGON',
    },
    categories: { type: DataTypes.STRING(), 
                  allowNull: true,
                  get() {
                    return this.getDataValue('categories')?.split(';')
                  },
                  set(val:any) {
                    if(typeof(val)!='string'){
                      return this.setDataValue('categories',val.join(';'));
                    }else{
                      return this.setDataValue('categoreis', val)
                    }
                  },
                 },
  },
  {
    tableName: 'nfts',
    indexes: [
      {
        unique: true,
        fields: ['nftId'],
      },
    ],
  }
);

NftModel.belongsTo(CollectionsModel,{
  as: 'Collection',
  foreignKey: 'collectionId'
})
CollectionsModel.hasMany(NftModel, {
  as: 'nfts',
  foreignKey: 'collectionId'
});

NftModel.belongsTo(UsersModel,{
  as: 'Owner',
  foreignKey: 'owner'
})
UsersModel.hasMany(NftModel, {
  as: 'createdNfts',
  foreignKey: 'owner'
});

NftModel.belongsTo(UsersModel,{
  as: 'Creator',
  foreignKey: 'creator'
})
UsersModel.hasMany(NftModel, {
  as: 'ownedNfts',
  foreignKey: 'creator'
});
// This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
// NftModel.sync({ alter: true });

export default NftModel;
