// rooms-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import RoomTypeEnum from '../constants/room-type.enum';
import { Application } from '../declarations';
import { Model, Mongoose } from 'mongoose';

export default function (app: Application): Model<any> {
  const modelName = 'rooms';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      roomNumber: {
        type: String,
        required: true,
        unique: true,
      },
      floor: {
        type: Schema.Types.ObjectId,
        ref: 'floors',
        required: true,
      },
      roomType: {
        type: String,
        enum: RoomTypeEnum,
        required: true,
      },
      capacity: {
        type: Number,
        required: true,
      },
      pricePerNight: {
        type: Number,
      },
      description: {
        type: String,
      },
      images: [
        {
          type: String,
        },
      ],
      amenities: [
        {
          type: String,
        },
      ],
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      deleted: {
        type: Boolean,
        index: true,
        default: false,
      },
      deletedBy: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
      deletedAt: {
        type: Date,
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
