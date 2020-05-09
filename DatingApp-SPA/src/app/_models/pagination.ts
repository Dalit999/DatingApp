import { YearPickerComponent } from 'ngx-bootstrap/datepicker/public_api';

export interface Pagination
{
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}
export class PaginatedResult<T>{
    result: T;
    pagination: Pagination;
}