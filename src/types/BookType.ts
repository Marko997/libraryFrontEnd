export default class BookType {
    bookId?: number;
    title?: string;
    excerpt?: string;
    description?: string;
    imageUrl?: string;
    isbn?: string;
    categoryId?: number;
    status?:
    | "rented"
    | "lost"
    | "destroyed"
    | "avaiable"
    | "not-avaiable"
    | "reserved";

    author?: {
        authorId: number;
        forename: string;
        surename: string;
    };
    photos?: {
        photoId: number;
        imagePath: string;
    }[];

    category?:{

        name:string;
    }
}