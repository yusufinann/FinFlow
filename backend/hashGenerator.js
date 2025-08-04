// hashGenerator.js
import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;
const password = '123456';

bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
  if (err) {
    console.error('Hashing hatası:', err);
    return;
  }
  console.log('Hashed Password:', hash);
});