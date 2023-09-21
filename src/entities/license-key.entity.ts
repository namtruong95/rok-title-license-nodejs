import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('license_keys')
export class LicenseKey {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  kingdom_id: number;

  @Column()
  key: string;

  @Column()
  ttl: number;

  @Column()
  number_of_scan_process: number;

  @Column({ type: 'timestamp' })
  activated_at: Date;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @Column({ type: 'timestamp' })
  deleted_at: Date;
}
