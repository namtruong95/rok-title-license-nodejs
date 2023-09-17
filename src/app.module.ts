import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LicenseKeyController } from './license-key/license-key.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kingdom } from './entities/kingdom.entity';
import { KingdomController } from './kingdom/kingdom.controller';
import { KingdomService } from './kingdom/kingdom.service';
import { LicenseKey } from './entities/license-key.entity';
import { LicenseKeyService } from './license-key/license-key.service';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from './constants/jwt';
import { LicenseKeyActivation } from './entities/license-key-activation.entity';
import { AuthController } from './auth/auth.controller';
import { ApiKeyService } from './auth/api-key.service';
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
} from './constants/db';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DB_HOST,
      port: DB_PORT,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      entities: [Kingdom, LicenseKey, LicenseKeyActivation],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Kingdom, LicenseKey, LicenseKeyActivation]),
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
    }),
  ],
  controllers: [
    AppController,
    LicenseKeyController,
    KingdomController,
    AuthController,
  ],
  providers: [AppService, KingdomService, LicenseKeyService, ApiKeyService],
  exports: [KingdomService],
})
export class AppModule {}
