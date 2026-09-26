import bcrypt from "bcrypt";

/*
|--------------------------------------------------------------------------
| Password Hashing
|--------------------------------------------------------------------------
|
| bcrypt is intentionally used instead of storing plaintext passwords.
|
| 12 rounds provides a strong password-hashing cost while remaining
| practical for a small portfolio administration system.
|
*/

const SALT_ROUNDS = 12;

/**
 * Hash a plaintext password.
 *
 * @param {string} password
 * @returns {Promise<string>}
 */
export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a plaintext password with an existing bcrypt hash.
 *
 * @param {string} password
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
