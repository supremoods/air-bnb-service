import { Op } from "sequelize";

import { AssociationType, IncludesType, QueryType } from "../types/BaseModelTypes";

export default class BaseModelHelper {

    static where(query:any) {
        query = this.convertQuery(query)
        return query
    }

    static includes(includes:Array<IncludesType> | Array<string>) {
        let associations: Array<AssociationType> = []
        //TODO: analyze deeper associations
        return associations
    }

    static select(fields:string, modelFields:Array<string>):Array<string> {
        let selectFields: Array<string> = []
        if (fields) {
            let _fields = [];
            if (fields.indexOf(',') > -1) _fields = fields.split(',');
            else if (fields.indexOf(' ') > -1) _fields = fields.split(' ');
            else _fields = [fields];
            _fields.forEach(field => {
                if (modelFields && modelFields.includes(field + "Id")) {
                    selectFields.push(field + "Id")
                } else selectFields.push(field)
            })
        }
        if (!selectFields.includes("_id")) selectFields.push("_id"); // selecting _id by default
        return selectFields
    }


    static sort(fields:object) {
        let conditions:Array<object> = []
        if (fields) {
            let keys = Object.keys(fields)
            keys.forEach(i => {
                let key = i as keyof typeof fields
                conditions.push([key, fields[key]])
            })
        }
        return conditions
    }

    static offset(page:number) {
        return page
    }

    static limit(limit:number) {
        return limit
    }



    static convertQuery(query:any) {
        if (!query) return query;
        if (Array.isArray(query))
            query.forEach(subQuery => {
                this.convertQuery(subQuery);
            })
        else if (typeof query == "object" && !Array.isArray(query))
            Object.keys(query).forEach(key => {
                let nested = query[key]
                this.replace(query, key);
                this.convertQuery(nested);
            })
        return query;
    }

    static replace(obj:object, _key:string) {
        
        const key = _key as keyof typeof obj
        const valueMatch:string = obj[key]
        let replacements = {
            $not: { [Op.not]: obj[key] },
            $and: { [Op.and]: obj[key] },
            $or: { [Op.or]: obj[key] },
            $ne: { [Op.ne]: obj[key] },
            $nin: { [Op.notIn]: obj[key] },
            $in: { [Op.in]: obj[key] },
            $lt: { [Op.lt]: obj[key] },
            $lte: { [Op.lte]: obj[key] },
            $gt: { [Op.gt]: obj[key] },
            $gte: { [Op.gte]: obj[key] },
            $contains: { [Op.contains]: obj[key] },
            $elemMatch: { [Op.contains]: !Array.isArray(obj[key]) ? [obj[key]] : obj[key] },
            $regex: {
                [Op.iLike]: obj[key]
                    && typeof obj[key] === 'string'
                    && key !== 'token' ? valueMatch.replace(/\.\*/g, '%') : '%'
            }
        }
        //remove unused operators
        if ('$options' === key) {
            delete obj[key]
        }

        let rep = replacements[key]
        if (rep) {
            Object.assign(obj, rep)
            delete obj[key]
        }
    }

    static handleAssociations(translated: QueryType, fields:Array<string>, associations?:Array<string>) {
        // TODO: improve looping syntax
        // current implem can only handle 1 nested objects
        // if (translated && translated.where) {
        //     Object.keys(translated.where).forEach(key => {
        //         if (fields.includes(key + "Id")) {
        //             translated.where[key + "Id"] = translated.where[key];
        //             delete translated.where?[key];
        //         } else if (associations.includes(key)) {
        //             if (!translated.include) translated.include = [];
        //             translated.include.push({
        //                 association: key,
        //                 where: {
        //                     _id: translated.where[key]
        //                 }
        //             })
        //             delete translated.where[key];
        //         }
        //     })
        // }
        return translated;
    }

}