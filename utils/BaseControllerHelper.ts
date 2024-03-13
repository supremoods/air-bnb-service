
import { BaseError, DatabaseError, ValidationError, UniqueConstraintError, ValidationErrorItem, ValidationErrorItemType, Op, Sequelize } from "sequelize";
import { RequestQuery, QueryOptions, ResponseType, CommonType } from "../types/BaseControllerTypes";

export function ConstructQuery(query: RequestQuery): QueryOptions {

    let options: QueryOptions = {}

    //where
    if (query.search) {
        let where: CommonType = {};
        const pairs = query.search.split(',')
        pairs.forEach((field) => {
            if (field.indexOf("|") > -1) {
                if (!where.hasOwnProperty(Op.or)) where[Op.or] = [];
                let orFields = field.split("|");
                orFields.forEach((orField) => {
                    let _field = getQueryField(orField);
                    if (_field) where[Op.or].push(_field);
                });
            } else {
                let _field = getQueryField(field);
                where = { ...where, ..._field };
            }
        });
        // pairs.forEach(pair => {
        //     let keyValue = pair.split(':')
        //     let key: string = keyValue[0]
        //     let value = keyValue[1]
        //     where[key] = value
        // })
        if (query.date_range) {
            let date_ranges = query.date_range.split(",");
            date_ranges.forEach((date_range) => {
                let pair = date_range.split(":");
                let date_query: CommonType = {};
                if (pair[1]) date_query[Op.gte] = new Date(pair[1] + "T00:00:00.000+08:00");
                if (pair[2]) date_query[Op.lt] = new Date(pair[2] + "T23:59:59.000+08:00");
                where[pair[0]] = date_query;
            });
        }

        //for full text search
        if(query.scan){
            where['_search'] = {[Op.match]: Sequelize.fn('to_tsquery', query.scan)}
        }

        options.where = where
    }

    //for full text search
    if(!query.search && query.scan){
        let where: CommonType = {};
        where['_search'] = {[Op.match]: Sequelize.fn('to_tsquery', query.scan)}
        options.where = where
    }

    // Allow pagination by default
    if (query.paginate != "false") {
        //limit
        options.limit = query.limit ? query.limit : 10

        //offset
        options.offset = query.page ? (query.page - 1) * options.limit : 0
    }

    //attributes
    if (query.fields) {
        const fields = query.fields.split(',')
        options.attributes = fields
    }

    //order
    if (query.sort) {
        let sortOptions: any = []
        const fields = query.sort.split(',')
        fields.forEach(field => {
            let orders = field.split(':')
            sortOptions.push(orders)
        })
        options.order = sortOptions
    }

    if (query.includes) {
        let data = query.includes.split(',')
        let includes:Array<any> = data.filter(el=>el.indexOf('.') == -1)
        //nested
        let nested = data.filter(el=>el.indexOf('.') > -1)
        nested.forEach(nest=>{
            let keypair = nest.split('.')
            let records:Array<any> = []
            for(let i = keypair.length - 1; i >= 0; i--){
                records.push({include: [{association: keypair[i].trim()}]})
            }
            let temp;
            for(let i = 0; i < records.length - 1; i++){
                records[i+1].include[0].include = records[i].include[0]
                temp = records[i+1].include[0]
            }

            includes.push(temp)
        })
        options.includes = includes
    }

    return options

}

function getQueryField(field: string) {
    let pair = field.split(":");
    let dataType = pair[2];
    let fieldKey = null,
        fieldValue = null;

    // variable:value:type
    switch (dataType) {
        case "Date": // value should be formatted as YYYY-MM-DD
            fieldKey = pair[0];
            fieldValue = {
                [Op.gte]: new Date(pair[1] + "T00:00:00.000+08:00"),
                [Op.lt]: new Date(pair[1] + "T23:59:59.000+08:00"),
            };
            break;

        case "Boolean":
            // search[pair[0]] = (pair[1] == "true");
            fieldKey = pair[0];
            fieldValue = pair[1] == "true";
            break;

        default:
            if (!pair[1]) return null;
            if (pair[1].startsWith(".*") && pair[1].endsWith(".*")) {
                // wildcard
                fieldKey = pair[0];
                fieldValue = {
                    [Op.iLike]: pair[1].replace(/\.\*/g, '%')
                };
            } else if (!isNaN(+pair[1])) {
                // integer
                // search[pair[0]] = parseInt(pair[1])
                fieldKey = pair[0];
                fieldValue = parseInt(pair[1]);
            } else {
                // id/fixed/whole word
                // search[pair[0]] = pair[1];
                fieldKey = pair[0];
                fieldValue = pair[1];
            }
    }
    return { [fieldKey]: fieldValue == "null" ? null : fieldValue };
};

export function ResponseHelper(response: any): ResponseType {
    let res: ResponseType = {
        success: true,
        response: response
    }
    return res;
}

export function ErrorResponseHandler(
    error: UniqueConstraintError
        | BaseError
        | Error
        | any): ResponseType {
    console.log('error :>> ', error);
    let res: ResponseType = { success: false }

    //check if the error is from sequelize
    if (error instanceof ValidationError) {
        res.error = 1001
        res.errorMessage = error.message
        res.errorDescription = error.errors[0].message
        res.errors = constructErrors(error.errors);
    } else if (error instanceof DatabaseError) {
        res.error = 1002
        res.errorMessage = error.message
    } else if (error instanceof Error) {
        res.error = 1003
        res.errorMessage = error.message
    }

    return res;
}

const ERROR_TYPE = {
    NOT_NULL: "notNull Violation"
}

function constructErrors(errors: ValidationErrorItem[]): string[] {
    var _errors: string[] = [];
    const error_types = Object.keys(ValidationErrorItemType)

    errors.forEach((error) => {
        switch (error.type?.toLowerCase()) {
            case error_types[0]: // notnull violation
                _errors.push(`${error.path} is required.`);
                break;

            case error_types[2]: // unique violation
                _errors.push(`${error.path} must be unique.`);
                break;

            case error_types[1]: // string violation
            case error_types[3]: // validation error
            default:
                _errors.push(error.message);
                break;
        }
    })
    return _errors
}
