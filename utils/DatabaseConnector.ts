import { Model, ModelStatic, Sequelize } from "sequelize";
import config from '../config/db.config'
import fs from "fs";


export default class DatabaseConnector {

    //for multi db connection
    private static connections: Array<Sequelize>;

    private static connection: Sequelize;

     constructor() {
        DatabaseConnector.connections = []

        DatabaseConnector.connection = new Sequelize(config.development.host!);
        //load single connection for now; to be modified later
        DatabaseConnector.connections.push(DatabaseConnector.connection)
    }

    getConnections(): Array<Sequelize> {
        return DatabaseConnector.connections.length > 0 ?
            DatabaseConnector.connections
            : [DatabaseConnector.connection]
    }

    async initializeModels() {
        let files = fs.readdirSync(`${process.cwd()}/models`)
            .filter((file) => file.indexOf(".") !== 0 && file.slice(-3) === ".ts");

        //initialize models
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            await import(`${process.cwd()}/models/${file}`).then(model => {
                //set associations
                if(model && model.default && model.default.associate){
                    model.default.associate()
                }
            })
         }
    }

    static getConnection(){
        return DatabaseConnector.connection
    }

    async connect(): Promise<void> {
        for (let i = 0; i < this.getConnections().length; i) {
            await this.getConnections()[i].authenticate()
        }
    }

    static getModel(modelName: string):ModelStatic<Model>{
        return DatabaseConnector.connection.models[modelName];
    }
}

