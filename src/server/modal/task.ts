import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITask extends Document {
    title: string;
    description: string;
    start_date: Date;
    end_date: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const TaskSchema = new Schema<ITask>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        start_date: { type: Date },
        end_date: { type: Date },
    },
    { timestamps: true }
);

const Task: Model<ITask> = mongoose.models.task
    ? (mongoose.models.task as Model<ITask>)
    : mongoose.model<ITask>("task", TaskSchema);

export default Task;
