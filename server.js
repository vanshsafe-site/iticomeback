import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import videoRoutes from "./routes/videos.js";
import adminRoutes from "./routes/admin.js";
// Load environment variables
dotenv.config();


// Create app
const app = express();


// Port
const PORT = process.env.PORT || 5000;




// Middleware

app.use(cors());

app.use(express.json());





// Test Route

app.get("/", (req, res)=>{

    res.json({

        message:
        "Iti Iti Yogashram API is running 🌿"

    });

});





// API Routes (we will create these next)


app.use("/api/auth", authRoutes);

app.use("/api/videos", videoRoutes);

app.use("/api/admin", adminRoutes);






// Start Server

app.listen(PORT, ()=>{

    console.log(
        `Server running on port ${PORT}`
    );

});