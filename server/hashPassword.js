const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Hashed password:", hashedPassword);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error.message);
    throw error;
  }
};

// Example usage
hashPassword("password123")
  .then((hashed) => console.log("Generated Hash:", hashed))
  .catch(console.error);
