import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  f_name?: string;
  l_name?: string;
  active?: boolean;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, required: true },
    f_name: { type: String, required: true },
    l_name: { type: String, required: true },
    active: { type: Boolean, default: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User
  ? (mongoose.models.User as Model<IUser>)
  : mongoose.model<IUser>("User", UserSchema);

export default User;
