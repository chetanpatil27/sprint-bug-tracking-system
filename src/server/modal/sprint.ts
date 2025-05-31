import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISprint extends Document {
    title: string;
    description: string;
    start_date: Date;
    end_date: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const SprintSchema = new Schema<ISprint>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        start_date: { type: Date },
        end_date: { type: Date },       
    },
    { timestamps: true }
);

const Sprint: Model<ISprint> = mongoose.models.sprint
    ? (mongoose.models.sprint as Model<ISprint>)
    : mongoose.model<ISprint>("sprint", SprintSchema);

export default Sprint;
