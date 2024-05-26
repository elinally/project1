import express from "express";
import mongoose from "mongoose"; 
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
const app = express();

dotenv.config();

app.use(express.json());
app.use("/api/auth", authRoutes );

app.get('/', (req, res) =>{
  res.json({message: 'Hi'})
})


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error(err);
  });

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));