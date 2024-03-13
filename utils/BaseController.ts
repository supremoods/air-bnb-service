
import { Request, Response, NextFunction } from 'express';

import { RequestQuery, QueryOptions, ResponseType } from '../types/BaseControllerTypes';
import { ConstructQuery, ResponseHelper, ErrorResponseHandler } from './BaseControllerHelper';
import DatabaseConnector from './DatabaseConnector';


export default class BaseController {

    protected _model;

    constructor(model?: string) {
        if (model) this._model = DatabaseConnector.getConnection().models[model];
    }

    /**
     * Find all the rows matching your query, within a specified offset / limit, 
     * and get the total number of rows matching your query.
     * ```js
     * Controller.find(req, res, next)
     * ```
     * @param req 
     * @param res 
     * @param next 
     */
    async find(req: Request, res: Response, next?: NextFunction): Promise<ResponseType> {
        try {

            let query: RequestQuery = req.query
            let options: QueryOptions = ConstructQuery(query)


            let response = null
            if(!response){
                console.log(':>> retrieving from database');
                response = await this._model?.findAndCountAll({
                    where: options.where,
                    limit: options.limit,
                    offset: options.offset,
                    attributes: options.attributes,
                    order: options.order,
                    include: options.includes
                })
            }

            return ResponseHelper(response)
        } catch (error) {
            throw ErrorResponseHandler(error)
        }
    }

    /**
     * Search for a single instance by its primary key. 
     * This applies LIMIT 1, so the listener will always be called with a single instance.
     * @param req 
     * @param res 
     * @param next 
     */
    async findById(req: Request, res: Response, next?: NextFunction): Promise<ResponseType> {
        try {
            const response = await this._model?.findByPk(req.params.id)
            return ResponseHelper(response)
        } catch (error) {
            throw ErrorResponseHandler(error)
        }
    }

    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    async create(req: Request, res: Response, next?: NextFunction): Promise<ResponseType> {
        try {
            let data: any = req.body
            let response = await this._model?.create(data)
            return ResponseHelper(response)
        } catch (error) {
            throw ErrorResponseHandler(error)
        }
    }

    /**
     * Update multiple instances that match the where options. The promise returns an array with one or two elements. The first element is always the number of affected rows, while the second element is the actual affected rows (only supported in postgres and mssql with options.returning true.)
     * @param req 
     * @param res 
     * @param next 
     */
    async update(req: Request, res: Response, next?: NextFunction): Promise<ResponseType> {
        try {
            let data: any = req.body
            let response = await this._model?.update(data, { where: req.params, returning: true })
            return ResponseHelper(response)
        } catch (error) {
            throw ErrorResponseHandler(error)
        }
    }

    /**
     * Delete multiple instances, or set their deletedAt timestamp to the current time if paranoid is enabled.
     * @param req 
     * @param res 
     * @param next 
     */
    async delete(req: Request, res: Response, next?: NextFunction): Promise<ResponseType> {
        try {
            let response = await this._model?.destroy({ where: req.params})
            return ResponseHelper(response)
        } catch (error) {
            throw ErrorResponseHandler(error)
        }
    }




    /**
     * ###############################################################
     * ###################### LIFE CYCLE HOOKS #######################
     * ###############################################################
     */

    async beforeCreate(req: Request) { }

    async afterCreate(req: Request) { }

    async beforeUpdate(req: Request) { }

    async afterUpdate(req: Request) { }

    async beforeFind(req: Request) { }

    async afterFind(req: Request) { }
}