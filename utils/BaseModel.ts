
import { Model } from "sequelize";
import { FindTypeEnum, QueryType } from '../types/BaseModelTypes';

import BaseModelHelper from './BaseModelHelper';

export default class BaseModel extends Model {

    protected _id?: number = 0;
    protected findType?: FindTypeEnum = FindTypeEnum.FIND_ALL;

    protected query?:object={};
    protected sortCondition?:object={};
    protected limitOption?:number = 0;
    protected pageOption?:number = 0;
    protected selectFields?:string ='';
    protected associations?:object={};

    protected includeFields?:Array<object> = [];

    protected isReturning?: boolean = false;
    protected raw?:boolean = false;
    protected nest?:boolean = false;
    protected distinct?:boolean = false;


    /**
     * 
     * @param query 
     * @returns 
     */
    find(query?:any):BaseModel {
        this.resetFields();
        this.query = query;
        this.distinct = true;
        this.findType = FindTypeEnum.FIND_ALL;
        return this;
    };

    /**
     * 
     * @param query 
     * @returns 
     */
    findOne(query:any):BaseModel {
        this.resetFields();
        this.query = query;
        this.findType = FindTypeEnum.FIND_ONE
        return this;
    };

    findById(id: number):BaseModel {
        this.resetFields();
        this.query = { _id: id }
        this.findType = FindTypeEnum.FIND_ONE
        return this;
    };

    populate(fields?:Array<object>| object):BaseModel  {
        if (!fields) return this
        if (!Array.isArray(fields)) {
            this.includeFields?.push(fields)
        } else {
            this.includeFields?.push(...fields)
        }
        return this;
    };

    sort(conditions: any):BaseModel {;
        this.sortCondition = conditions
        return this;
    };

    limit(option: number):BaseModel {
        this.limitOption = option
        return this;
    };

    skip(option:number):BaseModel {
        this.pageOption = option
        return this;
    };

    select(fields:any):BaseModel {
        this.selectFields = fields
        return this;
    }

    lean():BaseModel {
        this.raw = true;
        this.nest = true;
        return this;
    }

    async exec():Promise<void> {
        try {
            let options = this.translateQuery();
            return await Object.getPrototypeOf(this).executeFind(options, this.findType)
            // return await this.constructor.executeFind(options, this.findType)
        } catch (error) {
            console.log('error :>> ', error);
        }
    };



    translateQuery() {
        let translated:QueryType = {}
        try {
            if (this.query) translated.where = BaseModelHelper.where(this.query)
            if (this.includeFields && this.includeFields.length > 0) translated.include = BaseModelHelper.includes(this.includeFields)
            if (this.limitOption) translated.limit = BaseModelHelper.limit(this.limitOption)
            if (this.pageOption) translated.offset = BaseModelHelper.offset(this.pageOption)
            if (this.selectFields) translated.attributes = BaseModelHelper.select(this.selectFields, this.getFields())
            if (this.sortCondition) translated.order = BaseModelHelper.sort(this.sortCondition)
            if (this.isReturning) translated.returning = true;
            if (this.raw) translated.raw = true;
            if (this.nest) translated.nest = true;
            if (this.distinct) translated.distinct = "_id";
            translated = BaseModelHelper.handleAssociations(translated, this.getFields(), this.getAssociationsKeys())
        } catch (error) {
            console.error(`ERROR in translating query::: ${error}`);
        }
        return translated

    };

    getFields() {
        return Object.keys(BaseModel.getAttributes());
    }

    getAssociationsKeys() {
        return BaseModel.associations ? Object.keys(BaseModel.associations) : undefined;
    }


    resetFields() {
        this._id = 0;
        this.findType = FindTypeEnum.FIND_ALL;
        this.query = {};
        this.includeFields = [];
        this.sortCondition = {};
        this.limitOption = 0;
        this.pageOption = 0;
        this.selectFields = '';
        this.isReturning = false;
        this.raw = false;
        this.nest = false;
        this.distinct = false;
    }

}