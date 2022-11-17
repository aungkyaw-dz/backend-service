import { DataTypes } from 'sequelize';
import sequelize from '../config/db_connection';
import UsersModel from './users.model';
import CollectionsModel from './collections.model';
const ListModel = sequelize.define(
  'lists',
  {
    listId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    marketId: { type: DataTypes.DOUBLE(), allowNull: true },
    collectionId: { type: DataTypes.INTEGER(), allowNull: false },
    price: { type: DataTypes.DOUBLE, allowNull: true, defaultValue: 0 },
    total: { type: DataTypes.DOUBLE, allowNull: true, defaultValue: 0 },
    creator: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(),
      values: ['LISTING', 'SOLDOUT', 'EXPIRED'],
      defaultValue: 'LISTING',
    },
  },
  {
    tableName: 'lists',
  }
);

ListModel.belongsTo(UsersModel, {
  as: 'Creator',
  foreignKey: 'creator'
})
UsersModel.hasMany(ListModel, {
  as: 'ownedlist',
  foreignKey: 'creator'
});

ListModel.belongsTo(CollectionsModel,{
  as: 'collection',
  foreignKey: 'collectionId'
})
CollectionsModel.hasMany(ListModel, {
  as: 'listedItems',
  foreignKey: 'collectionId'
});

// This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
// CollectionsModel.sync({ alter: true });

export default ListModel;
