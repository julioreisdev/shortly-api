import connection from "../databases/postgresql.js";
import userSchema from "../schemas/userSchema.js";
import bcrypt from "bcrypt";

export async function signUp(req, res) {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const erros = error.details.map((d) => d.message);
    return res.status(422).send(erros);
  }
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.sendStatus(422);
  }
  try {
    const { rows: user } = await connection.query(
      `
      SELECT * FROM users WHERE email = $1
    `,
      [email]
    );
    if (user.length !== 0) {
      return res.sendStatus(409);
    }
    await connection.query(
      `
      INSERT INTO users (name, email, password) 
      VALUES ($1, $2, $3)
    `,
      [name, email, bcrypt.hashSync(password, 10)]
    );
    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function signIn(req, res) {
  return res.send("BOA demais");
}
