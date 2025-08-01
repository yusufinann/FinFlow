import mysql from 'mysql2/promise'; 

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'finflowdb',
  password: '12345678', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('MySQL veritabanına başarıyla bağlanıldı.');
        connection.release(); 
    })
    .catch(err => {
        console.error('MySQL bağlantı hatası:', err);
    });

export default pool;