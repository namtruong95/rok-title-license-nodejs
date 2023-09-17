import { IsNotEmpty } from 'class-validator';

export class ApiKeyDto {
  @IsNotEmpty()
  api_key: string;
}
