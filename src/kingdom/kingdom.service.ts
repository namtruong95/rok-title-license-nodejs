import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Kingdom } from 'src/entities/kingdom.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KingdomService {
  constructor(
    @InjectRepository(Kingdom)
    private kingdomRepository: Repository<Kingdom>,
  ) {}

  getAll(): Promise<Kingdom[]> {
    return this.kingdomRepository.find();
  }
}
