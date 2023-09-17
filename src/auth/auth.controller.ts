import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiKeyService } from 'src/auth/api-key.service';
import { ApiKeyDto } from 'src/dto/api-key.dto';
import { Response } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post('api-key')
  async activation(@Body() apiKeyDto: ApiKeyDto, @Res() res: Response) {
    const token = await this.apiKeyService.loginByApiKey(apiKeyDto);

    res.status(HttpStatus.CREATED).json({
      access_token: token,
    });
  }
}
