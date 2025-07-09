export class Book {
    title: string;
    ISBN: string;
    copiesOwned: number;

    constructor(row) {
        this.title = row['title'];
        this.ISBN = row['ISBN'];
        this.copiesOwned = row['copies_owned'];
    }
}
