import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  f_name?: string;
  l_name?: string;
  isActive?: boolean;
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
    isActive: {
      type: Boolean,
      default: true,
    },
    password: { type: String },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.user
  ? (mongoose.models.user as Model<IUser>)
  : mongoose.model<IUser>("user", UserSchema);

export default User;
