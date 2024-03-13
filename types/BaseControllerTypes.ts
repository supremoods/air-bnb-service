import { Order, WhereOptions } from "sequelize";

export type RequestQuery = {
    search?:string;
    limit?:number;
    page?:number;
    includes?:string;
    fields?:string;
    sort?:string;
    paginate?: string;
    date_range?: string;
    others?: any;
    scan?:string;
}

export type QueryOptions = {
    where?:WhereOptions<any>;
    limit?:number;
    offset?:number;
    attributes?: Array<string>;
    order?:Order;
    includes?:Array<string | IncludeType>;
}


export type ResponseType = {
    success: boolean;
    error?: number;
    errorMessage?: string,
    errorDescription?:string
    response?: object,
    version?: string,
    errors?: string[]
}

export type IncludeType = {
    association?: string;
    include?: Array<IncludeType>
}

export type CommonType = { [x: string | symbol]: any }
