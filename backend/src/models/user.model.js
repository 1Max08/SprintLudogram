import mongoose from 'mongoose';
 
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  roles: { type: [String], default: ['user'] },
  avatarUrl: { type: String }
}, { timestamps: true });
 
export default mongoose.model('User', userSchema);