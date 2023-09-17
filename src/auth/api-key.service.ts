import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { API_KEY, JWT_SECRET_ADMIN } from 'src/constants/jwt';
import { ApiKeyDto } from 'src/dto/api-key.dto';

@Injectable()
export class ApiKeyService {
  constructor(private jwtService: JwtService) {}

  async loginByApiKey(apiKeyDto: ApiKeyDto) {
    if (apiKeyDto.api_key === API_KEY) {
      const jwtOptions: JwtSignOptions = {
        expiresIn: '1h',
        notBefore: 0,
        secret: JWT_SECRET_ADMIN,
      };

      const token = await this.jwtService.signAsync(
        {
          sub: 'any',
        },
        jwtOptions,
      );
      return token;
    }

    throw new BadRequestException();
  }
}
