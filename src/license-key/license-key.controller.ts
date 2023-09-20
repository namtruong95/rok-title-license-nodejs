import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LicenseKeyService } from './license-key.service';
import { ActivationDto } from 'src/dto/activation.dto';
import { Response } from 'express';
import { LicenseKeyGuard } from './license-key.guard';
import { LicenseKey } from 'src/entities/license-key.entity';
import { AdminGuard } from 'src/guards/admin.guard';
import { CreateLicenseKeyDto } from 'src/dto/create.license-key.dto';

@Controller('api/license-key')
export class LicenseKeyController {
  constructor(private readonly licenseKeyService: LicenseKeyService) {}

  @UseGuards(LicenseKeyGuard)
  @Get('authentication')
  async authentication(@Request() req, @Res() res: Response) {
    const licenseKey: LicenseKey = req.licenseKey;

    const result = await this.licenseKeyService.authentication(licenseKey);

    res.status(HttpStatus.OK).json(result);
  }

  @Post('activation')
  async activation(@Body() activationDto: ActivationDto, @Res() res: Response) {
    const token =
      await this.licenseKeyService.activationLicenseKey(activationDto);

    res.status(HttpStatus.CREATED).json({
      access_token: token,
    });
  }

  @UseGuards(AdminGuard)
  @Post('new')
  async newLicenseKey(
    @Body() createLicenseKeyDto: CreateLicenseKeyDto,
    @Res() res: Response,
  ) {
    const result =
      await this.licenseKeyService.newLicenseKey(createLicenseKeyDto);

    res.status(HttpStatus.CREATED).json({
      key: result,
    });
  }
}
