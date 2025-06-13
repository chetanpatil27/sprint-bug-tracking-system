import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITeam extends Document {
    name: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    members?: string[]; // Array of user IDs or usernames
    active?: boolean;
}

const TeamSchema = new Schema<ITeam>(
    {
        name: { type: String, unique: true, required: true },
        description: { type: String },
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        active: { type: Boolean, default: true }
    },
    { timestamps: true }
);

const Team: Model<ITeam> = mongoose.models.Team
    ? (mongoose.models.Team as Model<ITeam>)
    : mongoose.model<ITeam>("Team", TeamSchema);

export default Team;
