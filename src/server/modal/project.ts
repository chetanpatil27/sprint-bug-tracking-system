import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProject extends Document {
    name: string;
    description: string;
    members: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

const ProjectSchema = new Schema<IProject>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }]
    },
    { timestamps: true }
);

const Project: Model<IProject> = mongoose.models.Project
    ? (mongoose.models.Project as Model<IProject>)
    : mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
