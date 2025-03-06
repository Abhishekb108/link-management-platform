const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.js"); // Import auth routes
const profileRoutes = require("./routes/profile.js"); // Import profile routes
const User = require("./models/User.js"); // Import the User model

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({}));

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Test creating a sample user (only if it doesn’t exist)
    const testEmail = "testuser@example.com"; // Use a unique email for testing
    User.findOne({ email: testEmail })
      .then((existingUser) => {
        if (!existingUser) {
          const testUser = new User({
            firstName: "Test",
            lastName: "User",
            email: testEmail,
            password: "password123", // This will be hashed by bcrypt in real routes
            username: "testuser",
            category: "Business",
          });

          testUser
            .save()
            .then(() => {
              console.log("Sample user created successfully");
            })
            .catch((error) => {
              console.error("Error creating sample user:", error);
            });
        } else {
          console.log("Sample user already exists, skipping creation");
        }
      })
      .catch((error) => {
        console.error("Error checking sample user:", error);
      });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Routes
app.use("/api", authRoutes); // Use auth routes
app.use("/api/profile", profileRoutes); // Use profile routes

app.get("/", (req, res) => {
  res.send("SPARK Backend is running!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
