import database from "infra/database.js";
import { getVersion } from "jest";
import { Query } from "pg";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionQuery = await database.query("SHOW server_version;");
  await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionQuery.rows[0].server_version;

  const databaseMaxConnectionsQuery = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsQuery.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsQuery = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname=$1;",
    values: [databaseName],
  });
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsQuery.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
