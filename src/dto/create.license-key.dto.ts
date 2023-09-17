import { IsNotEmpty, Min } from 'class-validator';

export class CreateLicenseKeyDto {
  @IsNotEmpty()
  kingdom: string;

  @IsNotEmpty()
  @Min(1)
  ttl: number;
}
