import { IsNotEmpty, Min } from 'class-validator';

export class CreateLicenseKeyDto {
  @IsNotEmpty()
  kingdom: string;

  @IsNotEmpty()
  @Min(1)
  ttl: number;

  @IsNotEmpty()
  @Min(2)
  number_of_scan_process: number;
}
