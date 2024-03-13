

const GET = 'get'
const POST = 'post'
const PUT = 'put'
const PATCH = 'patch'
const DELETE = 'delete'

import express from 'express'
import { Request, Response, NextFunction, Router } from 'express'
import BaseController from './BaseController';
import { Mappings } from '../types/BaseRouterTypes'
import { ResponseType } from '../types/BaseControllerTypes'

export default class BaseRouter<T extends BaseController> {
    public grantPublicAccess: boolean = false;
    public controller:T;
    /**
     * 
     * @param {Controller} controller 
     */
    constructor(controller:T) {
        this.controller = controller
        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
        this.getId = this.getId.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this)
    }

    /**
     * @description GET route
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     */
    async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        let response:ResponseType;
        try {
            response = await this.controller.find(req, res, next)
            res.status(200).json(response)
        } catch (error) {
            res.status(422).json(error)
        }
    }

    /**
     * @description POST route
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     */
    async post(req: Request, res: Response, next: NextFunction): Promise<void> {
        let response:ResponseType;
        try {
            response = await this.controller.create(req, res, next)
            res.status(200).json(response)
        } catch (error) {
            res.status(422).json(error)
        }
    }

    /**
     * @description GET route (/:id) 
     * @param {HttpRequest} req 
     * @param {HttpResponse} res 
     * @param {*} next 
     */
    async getId(req: Request, res: Response, next: NextFunction): Promise<void> {
        let response:ResponseType;
        try {
            response = await this.controller.findById(req, res, next)
            res.status(200).json(response)
        } catch (error) {
            res.status(422).json(error)
        }
    }

    /**
     * @description PUT route (/:id) 
     * @param {HttpRequest} req 
     * @param {HttpResponse} res 
     * @param {*} next 
     */
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        let response:ResponseType;
        try {
            response = await this.controller.update(req, res, next)
            res.status(200).json(response)
        } catch (error) {
            res.status(422).json(error)
        }
    }

    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        let response:ResponseType;
        try {
            response = await this.controller.delete(req, res, next)
            res.status(200).json(response)
        } catch (error) {
            res.status(422).json(error)
        }
    }


    /**
     * @description default mappings that will be inherited across all router class
     * @returns {Array} mappings
     */
    getMapping = ():Mappings[] => {
        return [
            { method: GET, path: '/', function: this.get },
            { method: POST, path: '/', function: this.post },
            { method: GET, path: '/:id', function: this.getId },
            { method: PUT, path: '/:id', function: this.update },
            { method: DELETE, path: '/:id', function: this.delete },
        ]
    }

    /**
     * @description additional mappings placeholder, designed to be overriden
     * @returns {Array} mappings
     */
    getAdditionalMapping = ():Mappings[] => {
        return []
    }


    /**
     * @description create the express router
     * @returns {Router} router
     */
    getRoutes():Router {
        const router:Router = express.Router();
        
        this.getAdditionalMapping().forEach(mapping => {
            let route = router.route(mapping.path)
            let method = mapping.method.toLowerCase() as keyof typeof route;
            route[method](mapping.function)
        })

        this.getMapping().forEach(mapping => {
            let route = router.route(mapping.path)
            let method = mapping.method.toLowerCase() as keyof typeof route;

            if (mapping.middleware) {
                route[method](mapping.middleware, mapping.function)
            }else {
                route[method](mapping.function)
            }
        })

        return router;
    }

}
