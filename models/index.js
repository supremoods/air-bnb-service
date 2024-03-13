import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import Sequelize from "sequelize";
import enVariables from "../config/db.config.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "local";
console.log('env :>> ', env);
const config = enVariables[env];
const db = {};

export default class DatabaseService {
  static async init() {
    let sequelize;
    if (config.use_env_variable) {
      console.log('object')
      sequelize = new Sequelize(process.env[config.use_env_variable], config);
    } else {
      console.log('object :>> ');
      sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
      );
    }

    const files = fs.readdirSync(__dirname).filter((file) => {
      return (
        file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
      );
    });

    for (let i = 0; i < files.length; i++) {
      const model = (await import(`./${files[i]}`)).default(
        sequelize,
        Sequelize.DataTypes
      );
      db[model.name] = model;
    }

    Object.keys(db).forEach((modelName) => {
      if (db[modelName].associate) db[modelName].associate(db);
      db[modelName].setAssociations(db[modelName].associations);
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
    return db;
  }

  static getDb() {
    return db;
  }
}
