// bookings-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import BookingStatus, {
  BookingStatusList,
} from "../constants/booking-status.enum";
import { Application } from "../declarations";
import { Model, Mongoose } from "mongoose";

export default function (app: Application): Model<any> {
  const modelName = "bookings";
  const mongooseClient: Mongoose = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;

  const schema = new Schema(
    {
      user: {
        /**
         * @todo
         * There can be high profile guests whose bookking is to be done by
         * the officials.Hence a user account wont be available
         * so a generalized dummy user to be created and ported here,
         * can only be done via SUPER_ADMIN
         */
        type: ObjectId,
        ref: "users",
        required: true,
      },
      room: {
        type: ObjectId,
        ref: "rooms",
        required: true,
      },
      dates: [
        {
          type: Date,
        },
      ],
      lastManagedBy: {
        type: ObjectId,
        ref: "users",
      },
      /**
       * flag to determine whether the booking was done by superadmin,or not
       */
      doneByAdmin: {
        type: Boolean,
        default: false,
      },
      paid: {
        type: Boolean,
        default: false,
      },
      status: {
        type: String,
        enum: BookingStatusList,
        default: BookingStatus.PENDING,
      },
      createdBy: {
        type: ObjectId,
        ref: "users",
        required: true,
      },
      deleted: {
        type: Boolean,
        index: true,
        default: false,
      },
      deletedBy: {
        type: ObjectId,
        ref: "users",
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
