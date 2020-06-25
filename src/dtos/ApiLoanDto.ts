export default interface ApiLoanDto{
    loanId?: number;
    studentId?: number;
    librarianId?: number;
    bookId?: number;
    createdAt?: string;
    expectedToBeReturnedAt?:string;
    status:'pending'|'loaned'|'returned'|'lost';
    returnedAt: string;
  }