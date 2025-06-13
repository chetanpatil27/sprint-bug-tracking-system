import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  f_name?: string;
  l_name?: string;
  is_active?: boolean;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
    },
    f_name: { type: String },
    l_name: { type: String },
    is_active: { type: Boolean, default: true, },
    password: { type: String },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User
  ? (mongoose.models.User as Model<IUser>)
  : mongoose.model<IUser>("User", UserSchema);

export default User;
