import express from "express";
import mongoose from "mongoose"; 
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import adRoutes  from "./routes/adRoutes.js";
import userRoutes from "./routes/userRoutes.js"

const app = express();

dotenv.config();

app.use(express.json());
app.use("/api/auth", authRoutes );

app.use("/api/ad", adRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) =>{
  res.json({message: 'Hi'})
})


const connectDB=async()=>{
  try{
      await mongoose.connect(process.env.MONGO_URL)
      console.log("database is connected successfully!")

  }
  catch(err){
      console.log(err)
  }
}


const PORT = process.env.PORT;
app.listen(PORT, () => {
  connectDB()
  console.log(`Server started on port ${PORT}`)
});