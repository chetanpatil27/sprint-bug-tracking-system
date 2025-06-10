import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBug extends Document {
    title: string;
    description: string;
    start_date: Date;
    end_date: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const BugSchema = new Schema<IBug>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        start_date: { type: Date },
        end_date: { type: Date },
    },
    { timestamps: true }
);

const Bug: Model<IBug> = mongoose.models.Bug
    ? (mongoose.models.Bug as Model<IBug>)
    : mongoose.model<IBug>("Bug", BugSchema);

export default Bug;
