export class Book {
    title: string;
    ISBN: string;
    copiesOwned: number;
    dueDate: string;
    inStock: number;

    constructor(row) {
        this.title = row['title'];
        this.ISBN = row['ISBN'];
        this.copiesOwned = row['copies_owned'];
        this.dueDate = row['due_date'];
        this.inStock = row['in_stock'];
    }
}
