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

export async function getUrlById(req, res) {
  const { id } = req.params;
  try {
    const { rows: url } = await connection.query(
      `
      SELECT * FROM urls WHERE id = $1
    `,
      [id]
    );
    if (url.length === 0) {
      return res.sendStatus(404);
    }
    return res.send({
      id: url[0].id,
      shortUrl: url[0].shortUrl,
      url: url[0].url,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
  res.send("BOA");
}

export async function openShortUrl(req, res) {
  const { shortUrl } = req.params;
  try {
    const { rows: url } = await connection.query(
      `
      SELECT * FROM urls WHERE "shortUrl" = $1
    `,
      [shortUrl]
    );
    if (url.length === 0) {
      return res.sendStatus(404);
    }
    const visitCount = url[0].visitCount + 1;
    await connection.query(
      `
      UPDATE urls SET "visitCount" = $1
      WHERE "shortUrl" = $2
    `,
      [visitCount, shortUrl]
    );
    return res.redirect(`${url[0].url}`);
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function deleteUrl(req, res) {
  const { id } = req.params;
  const { session } = res.locals;
  try {
    const { rows: url } = await connection.query(
      `
      SELECT * FROM urls WHERE id = $1
    `,
      [id]
    );
    if (url.length !== 0) {
      const { rows: urlUser } = await connection.query(
        `
        SELECT * FROM urls WHERE id = $1 AND "userId" = $2
      `,
        [id, session[0].userId]
      );
      if (urlUser.length === 0) {
        return res.sendStatus(401);
      }
      connection.query(
        `
        DELETE FROM urls WHERE id = $1
      `,
        [id]
      );
      return res.sendStatus(204);
    }
    res.sendStatus(404);
  } catch (error) {
    return res.status(500).send(error);
  }
}
