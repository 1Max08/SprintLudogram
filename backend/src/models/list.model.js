import mongoose from 'mongoose';
 
const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gameIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }]
}, { timestamps: true });
 
listSchema.index({ name: 1, ownerId: 1 }, { unique: true });
export default mongoose.model('List', listSchema);