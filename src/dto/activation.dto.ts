import { IsNotEmpty } from 'class-validator';

export class ActivationDto {
  @IsNotEmpty()
  key: string;
}
