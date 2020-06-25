import ApiBookDto from "./ApiBookDto";

export default interface ApiReservationDto{
    reservationId?: number;
    studentId?: number;
    book?: ApiBookDto;
    status:'pending'|'loaned'|'rejected';
    reservedAt?: string;

  }