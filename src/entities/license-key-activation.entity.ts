import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('license_key_activations')
export class LicenseKeyActivation {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  license_key_id: number;

  @Column()
  device_id: string;

  @Column({ type: 'timestamp' })
  expired_at: Date;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;
}
