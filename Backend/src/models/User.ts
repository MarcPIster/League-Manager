import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  _uid: number;
  username: string;
  email: string;
  password: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
  _uid: { type: Number, required: true, auto: true },
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
});

// Pre-save hook: Hash the password before saving
UserSchema.pre<IUser>('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (err) {
    next(err as any);
  }
});

// Instance method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema, 'UserDB');
export default User;
