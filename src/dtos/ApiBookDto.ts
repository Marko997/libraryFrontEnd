export default interface  ApiBookDto{
    bookId: number;
    title: string;
    categoryId: number;
    authorId: number;
    excerpt: string;
    description: string;
    isbn: string;
    status:
    | "rented"
    | "lost"
    | "destroyed"
    | "avaiable"
    | "not-avaiable"
    | "reserved";

    author: {
        authorId: number;
        forename: string;
        surename: string;
    };
    photos: {
        photoId: number;
        imagePath: string;
    }[];
    category:{
        name:string;
    }
}