const bcrypt = require('bcryptjs');

async function hashPassword() {
  const password = 'password123';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log('Hashed password:', hashedPassword);
}

hashPassword().catch(console.error);