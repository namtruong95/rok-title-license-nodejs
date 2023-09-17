import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('kingdoms')
export class Kingdom {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  home: string;

  @Column({ type: 'timestamp' })
  latest_active_at: Date;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @Column({ type: 'timestamp' })
  deleted_at: Date;
}
