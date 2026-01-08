import mysql from 'mysql2/promise';

async function checkTables() {
  const conn = await mysql.createConnection('mysql://root@localhost:3306/gravy2');
  const [rows] = await conn.query('SHOW TABLES');
  console.log('Tablas en gravy2:');
  console.log(rows);
  await conn.end();
}

checkTables();
