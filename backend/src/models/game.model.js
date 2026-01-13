import mongoose from 'mongoose';
 
const gameSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  imageUrl: { type: String },
  // auteur du jeu (créateur de la fiche)
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
 
export default mongoose.model('Game', gameSchema);