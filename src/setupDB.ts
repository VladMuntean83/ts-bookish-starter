import { config as SQLConfig } from 'mssql';
import sql from 'mssql';
import { Book } from './Book';
import * as dotenv from 'dotenv';
dotenv.config();

export const dbConfig: SQLConfig = {
    user: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || '',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

export async function getAllBooks(): Promise<Book[]> {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT * FROM dbo.BOOKS');

        return result.recordset.map((row) => new Book(row));
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

export async function getBookByID(id: string): Promise<Book[]> {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool
            .request()
            .query(`SELECT * FROM dbo.BOOKS where ISBN = '${id}';`);

        return result.recordset.map((row) => new Book(row));
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}
