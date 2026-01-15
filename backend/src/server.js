import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';
 
const { PORT = 4000, MONGO_URI } = process.env;
connectDB(MONGO_URI)

  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on : http://localhost:${PORT}`));
  })    
  .catch((err) => {
    console.error('MongoDB error:', err);
    process.exit(1);
  });