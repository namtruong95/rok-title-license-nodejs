import { Controller, Get, UseGuards } from '@nestjs/common';
import { KingdomService } from './kingdom.service';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('api/kingdom')
export class KingdomController {
  constructor(private readonly kingdomService: KingdomService) {}

  @UseGuards(AdminGuard)
  @Get()
  list() {
    return this.kingdomService.getAll();
  }
}
