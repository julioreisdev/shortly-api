import { nanoid } from "nanoid";
import connection from "../databases/postgresql.js";
import urlSchema from "../schemas/urlsSchema.js";

export async function shortUrl(req, res) {
  const { session } = res.locals;
  const { error } = urlSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const erros = error.details.map((d) => d.message);
    return res.status(422).send(erros);
  }
  const shortUrl = nanoid(8);
  const { url } = req.body;
  try {
    const { rows: urlExist } = await connection.query(
      `
      SELECT * FROM urls  WHERE url = $1 AND "userId" = $2
    `,
      [url, session[0].userId]
    );
    if (urlExist.length !== 0) {
      return res.sendStatus(409);
    }
    await connection.query(
      `
      INSERT INTO urls (url, "shortUrl", "userId", "visitCount")
      VALUES ($1, $2, $3, $4)
    `,
      [url, shortUrl, session[0].userId, 0]
    );
    res.status(201).send({ shortUrl });
  } catch (error) {
    return res.status(500).send(error);
  }
}
