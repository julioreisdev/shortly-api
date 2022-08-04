import connection from "../databases/postgresql.js";

export async function getUser(req, res) {
  const { session } = res.locals;
  try {
    const { rows: user } = await connection.query(
      `
      SELECT * FROM users WHERE id = $1
    `,
      [session[0].userId]
    );
    if (user.length === 0) {
      return res.sendStatus(404);
    }
    const { rows: dataUser } = await connection.query(
      `
      SELECT users.id, users.name, SUM(urls."visitCount") as "visitCount"
      FROM users
      JOIN urls ON urls."userId" = users.id
      WHERE users.id = $1
      GROUP BY users.id
    `,
      [session[0].userId]
    );
    const { rows: dataUrls } = await connection.query(
      `
      SELECT id, "shortUrl", url, "visitCount" FROM urls WHERE "userId" = $1
    `,
      [session[0].userId]
    );
    /* res.send({ dataUser, dataUrls }); */
    return res.send({
      id: dataUser[0].id,
      name: dataUser[0].name,
      visitCount: dataUser[0].visitCount,
      shortenedUrls: dataUrls,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
}
