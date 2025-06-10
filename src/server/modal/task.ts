import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITask extends Document {
    title: string;
    description: string;
    start_date: Date;
    end_date: Date;
    createdAt?: Date;
    updatedAt?: Date;
    assignees: mongoose.Types.ObjectId[];
    owner: mongoose.Types.ObjectId;
}

const TaskSchema = new Schema<ITask>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        start_date: { type: Date },
        end_date: { type: Date },
        assignees: { type: [Schema.Types.ObjectId], ref: "User" },
        owner: { type: Schema.Types.ObjectId, ref: "User" }
    },
    { timestamps: true }
);

const Task: Model<ITask> = mongoose.models.Task
    ? (mongoose.models.Task as Model<ITask>)
    : mongoose.model<ITask>("Task", TaskSchema);

export default Task;
