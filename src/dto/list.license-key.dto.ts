import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class ListLicenseKeyDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  page: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  limit: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === '1' || value === 'true') {
      return true;
    }

    if (value === '0' || value === 'false') {
      return false;
    }
  })
  is_activation: boolean;
}
