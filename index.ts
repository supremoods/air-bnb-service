import express,{ Application } from 'express'
import cors from "cors";
import RouterFactory from './utils/BaseRouterFactory';
import DatabaseConnector from './utils/DatabaseConnector';

const port:Number = 5000
const app:Application = express()

const start = async (app:Application) => {
    new RouterFactory(app)
    const db = new DatabaseConnector()
    app.listen(port,()=>console.log(`REST API server ready at: http://localhost:${port}`))    
}

app.use(express.json())
app.use(cors())
start(app)

