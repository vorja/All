import mysql from 'mysql2/promise';

let pool;

const getPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.AGRICOL_DB_HOST || '127.0.0.1',
      port: Number(process.env.AGRICOL_DB_PORT || 3306),
      user: process.env.AGRICOL_DB_USER || '',
      password: process.env.AGRICOL_DB_PASSWORD || '',
      database: process.env.AGRICOL_DB_NAME || '',
      waitForConnections: true,
      connectionLimit: 8,
      queueLimit: 0
    });
  }
  return pool;
};

const query = async (sql, params = []) => {
  const [rows] = await getPool().query(sql, params);
  return rows;
};

export { query };
