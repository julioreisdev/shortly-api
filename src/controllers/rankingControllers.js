import connection from "../databases/postgresql.js";

export async function getRanking(req, res) {
  try {
    const { rows: ranking } = await connection.query(`
      SELECT users.id, users.name, COUNT(urls."visitCount") AS "linksCount",
      CASE 
      WHEN SUM(urls."visitCount") IS NULL THEN '0' 
      ELSE SUM(urls."visitCount") 
      END AS "visitCount"
      FROM users
      LEFT JOIN urls ON urls."userId" = users.id
      GROUP BY users.id
      ORDER BY "visitCount" DESC
      LIMIT 10
    `);
    return res.send(ranking);
  } catch (error) {
    res.status(500).send(error);
  }
}
