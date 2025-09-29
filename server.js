const express = require("express");
const sequelize = require("./Config/db");
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const authMiddlewaer = require("./middlewear/authMiddlewear");

require("dotenv").config();

const app = express();
app.use(express.json());

//Routes
app.use("/auth", authRoutes);


//Protected route example 
app.get("/profile",authMiddlewaer, (req, res) => {
    res.json({message:"Welcome to your profile", user:req.user});
});

//syncing the database
sequelize.sync()
.then(()=>{
    console.log("Database is synced");
});


sequelize.authenticate()
  .then(() => console.log("✅ DB connected"))
  .catch(err => console.error("❌ DB connection failed:", err.message));


app.listen(process.env.PORT, () => console.log(`🚀 Server running on http://localhost:${process.env.PORT}`));