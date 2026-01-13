import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';
 
const { PORT = 4000, MONGODB_URI } = process.env;
 
connectDB(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`API sur http://localhost:${PORT}`));
  })    
  .catch((err) => {
    console.error('MongoDB error:', err);
    process.exit(1);
  });