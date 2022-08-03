import connection from "../databases/postgresql.js";

export async function tokenValidate(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  try {
    const { rows: session } = await connection.query(
      `
      SELECT * FROM sessions WHERE token = $1
    `,
      [token]
    );
    if (session.length === 0) {
      return res.sendStatus(401);
    }
    res.locals.session = session;
  } catch (error) {
    return res.status(500).send(error);
  }
  next();
}
