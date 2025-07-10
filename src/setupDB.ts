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
        const result = await pool
            .request()
            .query('SELECT * FROM dbo.BOOKS order by title');

        return result.recordset.map((row) => new Book(row));
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

export async function getBookByID(id: string, stock = false): Promise<Book[]> {
    try {
        const pool = await sql.connect(dbConfig);
        let result;

        if (stock)
            result = await pool.request()
                .query(`SELECT b.*, b.copies_owned - count(br.ISBN) 'in_stock' from books b, borrowed br
                        where b.ISBN = '${id}' and b.ISBN = br.ISBN group by b.title, b.ISBN, b.copies_owned;`);
        else
            result = await pool
                .request()
                .query(`SELECT * FROM books where ISBN = '${id}';`);

        return result.recordset.map((row: any) => new Book(row));
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

export async function addBook(data: object): Promise<void> {
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request().query(`INSERT INTO dbo.BOOKS VALUES (
                              '${data['title']}',
                              '${data['ISBN']}',
                               ${data['copies_owned']});

                    INSERT INTO dbo.AUTHORS VALUES (
                                 ${data['author_id']},
                                '${data['name']}',
                                '${data['ISBN']}');
            `);
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

export async function getUserBooks(name: string): Promise<Book[]> {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool
            .request()
            .query(
                'select distinct b.*, br.due_date from books b, borrowed br, users u\n' +
                    'where br.user_id = u.user_id\n' +
                    'and br.ISBN = b.ISBN\n' +
                    `and u.name = '${name}';`,
            );

        return result.recordset.map((row) => new Book(row));
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

export async function fetchAllUsers(): Promise<string[]> {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool
            .request()
            .query('SELECT DISTINCT name FROM users');

        return result.recordset;
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

export async function getBooksByTitle(
    title: string | unknown,
): Promise<Book[]> {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool
            .request()
            .query(`SELECT * FROM dbo.BOOKS where title = '${title}';`);

        return result.recordset.map((row) => new Book(row));
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

export async function getBooksByAuthor(
    author: string | unknown,
): Promise<Book[]> {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool
            .request()
            .query(
                `SELECT b.* FROM books b, authors a where a.ISBN = b.ISBN and a.name = '${author}';`,
            );

        return result.recordset.map((row) => new Book(row));
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}
