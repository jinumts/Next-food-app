import sql from "better-sqlite3";
import bcrypt from "bcrypt";

const db = sql("meals.db");

export function registerUser(user) {
  console.log(user,'user')
  const hashedPassword = bcrypt.hashSync(user.password, 10);
  user.password = hashedPassword
  const result = db.prepare(`
    INSERT INTO users (username, email, password)
    VALUES (@username, @email, @password)
  `).run(user);
   console.log(result,'result')
  return result.lastInsertRowid;
}

export async function loginUser(user) {
  let email = user.email
  let password = user.password
  const userExists = await db.prepare('SELECT * FROM users WHERE email = ?').get(email);

   console.log(userExists,'userExists789')
  if (!userExists) {
    return null; // User not found
  }

  const passwordMatch = bcrypt.compareSync(password, userExists.password);
  if (!passwordMatch) {
    return null; // Incorrect password
  }

  return {
    id: userExists.id,
    username: userExists.username,
    email: userExists.email,
  };
}
