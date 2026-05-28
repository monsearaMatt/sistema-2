import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RolService } from '../application/rol.service';

@Controller('rrhh/roles')
@UsePipes(new ValidationPipe({ transform: true }))
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post()
  async create(@Body('name_rol') name_rol: string) {
    return this.rolService.create(name_rol);
  }

  @Get()
  async findAll() {
    return this.rolService.findAll();
  }
}
