import fs from 'fs'
import path from 'path'

import {Application, Request, Response, NextFunction} from 'express';



export default class RouterFactory{

    constructor(app:Application, folderName:string = 'routes'){
        try {
            const API_CONTEXT = process.env['API_CONTEXT'] || "airbnb";

            fs.readdirSync(folderName).forEach((dir) => {
                const routerDir:string = path.join(folderName, dir);
                fs.readdirSync(routerDir).forEach((file) => {
                    const fileName = path.join(routerDir, file)
                    console.log('fileName :>> ', fileName);
                    if(file.toLowerCase().indexOf(".js") || file.toLowerCase().indexOf(".ts")){
                        
                        const routeName:string = fileName.replace(folderName, API_CONTEXT).replace(".ts", "").split("\\").join("/")
                        console.log('routeName :>> ', routeName);
                        const endpoint = `/${routeName}`
                        const routerPath = `../${fileName}`
                        console.log('routeName :>> ', routeName);

                        import(routerPath).then((routerClass) => {

                            console.log('routerClass :>> ', routerClass);
                            const router = new routerClass.default()
                            app.use(endpoint, router.getRoutes())
                            console.log("\x1b[36m", `Initializing endpoint: ${endpoint}`,"\x1b[0m");
                        })
                    }
                })
            })
        } catch (error) {
            console.log('error :>> ', error);
        }
    }

}