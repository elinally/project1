import express from "express";
import mongoose from "mongoose"; 
import dotenv from "dotenv";

const app = express();

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error(err);
  });


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));