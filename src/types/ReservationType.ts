import ApiBookDto from "../dtos/ApiBookDto";

export default interface ReservationType {
    reservationId?: number;
    studentId?: number;
    book?: ApiBookDto;
    status:'pending'|'loaned'|'rejected';
    reservedAt?: string;

    
}