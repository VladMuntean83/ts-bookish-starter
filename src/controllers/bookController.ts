import { Router, Request, Response } from 'express';
import {
    getBookByID,
    getAllBooks,
    addBook,
    getUserBooks,
    fetchAllUsers,
    getBooksByTitle,
    getBooksByAuthor,
} from '../setupDB';
import { Book } from '../Book';

class BookController {
    router: Router;

    constructor() {
        this.router = Router();

        this.router.get('/users', this.getAllUsers.bind(this));
        this.router.get('/users/:name', this.getUser.bind(this));
        this.router.get('/stock/:id', this.getBookStock.bind(this));
        this.router.get('/:id/', this.getBook.bind(this));

        this.router.post('/', this.createBook.bind(this));
        this.router.get('/', this.getAllBooks.bind(this));
    }

    async getBook(req: Request, res: Response) {
        try {
            const books = await getBookByID(req.params.id);
            return res.status(200).json({ books });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    async createBook(req: Request, res: Response) {
        try {
            await addBook(req.query);
            return res
                .status(200)
                .json({ message: 'Book created successfully.' });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    async getAllBooks(req: Request, res: Response) {
        try {
            const params = req.query;
            let books: Book[];

            if ('title' in params) {
                books = await getBooksByTitle(params.title);
            } else if ('author' in params) {
                books = await getBooksByAuthor(params.author);
            } else {
                books = await getAllBooks();
            }

            return res.status(200).json({ books });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    async getUser(req: Request, res: Response) {
        try {
            const books: Book[] = await getUserBooks(req.params.name);
            return res.status(200).json({ books });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users: string[] = await fetchAllUsers();
            return res.status(200).json({ users });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    async getBookStock(req: Request, res: Response) {
        try {
            const books = await getBookByID(req.params.id, true);
            return res.status(200).json({ books });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}

export default new BookController().router;
