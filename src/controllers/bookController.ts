import { Router, Request, Response } from 'express';
import { getBookByID, getAllBooks } from '../setupDB';
import { Book } from '../Book';

class BookController {
    router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/:id', this.getBook.bind(this));

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

    createBook(req: Request, res: Response) {
        // TODO: implement functionality
        return res.status(500).json({
            error: 'server_error',
            error_description: 'Endpoint not implemented yet.',
        });
    }

    async getAllBooks(req: Request, res: Response) {
        try {
            const books: Book[] = await getAllBooks();
            return res.status(200).json({ books });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}

export default new BookController().router;
