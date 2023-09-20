import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnNumberOfScanProcessToLicenseKeysTable1695195255709
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('license_keys', [
      new TableColumn({
        name: 'number_of_scan_process',
        type: 'int',
        isNullable: false,
        default: 2,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('license_keys', ['number_of_scan_process']);
  }
}
