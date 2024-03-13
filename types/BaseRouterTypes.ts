import { Request, Response, NextFunction, IRoute } from 'express'
import { ResponseType } from './BaseControllerTypes'

export type Mappings = {
    path: string,
    method: string,
    function: (req: Request, res:Response, next: NextFunction) => Promise<void | ResponseType>,
    middleware?: (req: Request, res:Response, next: NextFunction) => Promise<void>
}