

import {Request, Response, NextFunction, response} from 'express'
import BaseController from "../utils/BaseController";
import Users from '../models/UserModel';
import { ResponseHelper } from '../utils/BaseControllerHelper';

export default class UserController extends BaseController {
   constructor(){
      super(Users.modelName)
   }

}