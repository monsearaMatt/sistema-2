import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class RolService {
  constructor(private readonly prisma: PrismaService) {}

  async create(name_rol: string) {
    return this.prisma.rRHH_rol.create({
      data: { name_rol },
    });
  }

  async findAll() {
    return this.prisma.rRHH_rol.findMany({
      include: {
        _count: { select: { RRHH_empleado: true } },
      },
    });
  }
}
