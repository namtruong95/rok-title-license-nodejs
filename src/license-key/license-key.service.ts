import { HttpException, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { JWT_ISS } from 'src/constants/jwt';
import { ActivationDto } from 'src/dto/activation.dto';
import { CreateLicenseKeyDto } from 'src/dto/create.license-key.dto';
import { Kingdom } from 'src/entities/kingdom.entity';
import { LicenseKeyActivation } from 'src/entities/license-key-activation.entity';
import { LicenseKey } from 'src/entities/license-key.entity';
import { random } from 'src/utils/string';
import { DataSource, IsNull, Repository } from 'typeorm';

@Injectable()
export class LicenseKeyService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Kingdom)
    private kingdomRepository: Repository<Kingdom>,
    @InjectRepository(LicenseKey)
    private licenseKeyRepository: Repository<LicenseKey>,
    @InjectRepository(LicenseKeyActivation)
    private licenseKeyActivationRepository: Repository<LicenseKeyActivation>,
    private jwtService: JwtService,
  ) {}

  async authentication(licenseKey: LicenseKey) {
    const licenseKeyActivation =
      await this.licenseKeyActivationRepository.findOne({
        where: {
          license_key_id: licenseKey.id,
        },
        order: {
          created_at: 'DESC',
        },
      });

    this.kingdomRepository.update(
      { id: licenseKey.kingdom_id },
      {
        latest_active_at: moment().toDate(),
      },
    );
    const expiredAt = moment(licenseKeyActivation.expired_at);
    const now = moment();

    const days = expiredAt.diff(now, 'days');
    const hours = expiredAt.subtract(days, 'days').diff(now, 'hours');

    return { days, hours };
  }

  async activationLicenseKey(activationDto: ActivationDto) {
    const licenseKey = await this.licenseKeyRepository.findOne({
      where: {
        key: activationDto.key,
        activated_at: IsNull(),
      },
    });

    if (!licenseKey) {
      throw new HttpException('License key invalid.', 400);
    }

    const jwtOptions: JwtSignOptions = {
      expiresIn: `${licenseKey.ttl}d`,
      issuer: JWT_ISS,
      notBefore: 0,
    };

    const token = await this.jwtService.signAsync(
      {
        sub: licenseKey.id,
        kingdom_id: licenseKey.kingdom_id,
      },
      jwtOptions,
    );

    const tokenDecode = this.jwtService.decode(token, {
      complete: true,
      json: true,
    });

    const exp = moment.unix(tokenDecode['payload']['exp']);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(LicenseKey, licenseKey.id, {
        activated_at: moment().toDate(),
        updated_at: moment().toDate(),
      });

      await queryRunner.manager.insert(LicenseKeyActivation, {
        license_key_id: licenseKey.id,
        expired_at: exp.toDate(),
        created_at: moment().toDate(),
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();

      console.error(err);

      throw new HttpException('Unable to activated license key.', 400);
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }

    return token;
  }

  findById(id: number) {
    return this.licenseKeyRepository.findOneBy({ id });
  }

  async newLicenseKey(createLicenseKeyDto: CreateLicenseKeyDto) {
    let kingdom = await this.kingdomRepository.findOne({
      where: {
        home: createLicenseKeyDto.kingdom,
      },
    });

    if (!kingdom) {
      kingdom = await this.kingdomRepository.save({
        home: createLicenseKeyDto.kingdom,
        created_at: moment().toDate(),
      });
    }

    const licenseKey = await this.licenseKeyRepository.save({
      kingdom_id: kingdom.id,
      ttl: createLicenseKeyDto.ttl,
      created_at: moment().toDate(),
      key: random(49),
    });

    return licenseKey.key;
  }
}
