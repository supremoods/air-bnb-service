import BaseRouter from "../../utils/BaseRouter"
import { Mappings } from "../../types/BaseRouterTypes"
import UserController from "../../controller/users.controller"

export default class UserRoute extends BaseRouter<UserController> {
    
    private _controller: UserController = new UserController();

    constructor(){
        super(new UserController())
    }

    //sample for testing purposes
    getAdditionalMapping = ():Mappings[] => {
        return [
        ]
    }
}

