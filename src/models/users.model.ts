// users-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from "../declarations";
import { Model, Mongoose } from "mongoose";
import RolesEnum, { RolesEnumList } from "../constants/roles.enum";

export default function (app: Application): Model<any> {
  const modelName = "users";
  const mongooseClient: Mongoose = app.get("mongooseClient");
  const { ObjectId } = mongooseClient.Schema.Types;
  const schema = new mongooseClient.Schema(
    {
      // avatar: {
      //   type: String,
      // },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        unique: true,
        index: true,
        lowercase: true,
        required: true,
      },
      password: {
        type: String,
      },
      designation: {
        type: String,
      },
      type: {
        type: Number,
        enum: RolesEnumList,
        default: RolesEnum.USER,
        index: true,
      },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
      },
      data: {
        type: Object,
      },
    },
    {
      timestamps: true,
    }
  );

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<any>(modelName, schema);
}
