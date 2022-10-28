import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    public pageSize?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    public pageNumber?: number;
}
