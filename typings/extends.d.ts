import { SchemaMap } from "joi";
// import Joi = require("joi");

interface SchemaParam {
  body?: SchemaMap<any>;
  params?: SchemaMap<any>;
  query?: SchemaMap<any>;
}
declare module "egg" {
  interface Context {
    validateJoi(schema: SchemaParam): Object | any;
  }
}
