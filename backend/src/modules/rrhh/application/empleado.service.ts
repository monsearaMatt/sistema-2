import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CrearEmpleadoDto, ActualizarEmpleadoDto } from '../presentation/dto/crear-empleado.dto';

@Injectable()
export class EmpleadoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CrearEmpleadoDto) {
    const empleado = await this.prisma.rRHH_empleado.create({
      data: {
        rut: dto.rut,
        nombre: dto.nombre,
        RRHH_rol: { connect: { id_rol: dto.id_rol } },
        correo: dto.correo ?? null,
        telefono: dto.telefono ?? null,
        estado: dto.estado ?? 'Activo',
      },
      include: { RRHH_rol: true },
    });
    return this.toFrontend(empleado);
  }

  async findAll() {
    const empleados = await this.prisma.rRHH_empleado.findMany({
      include: { RRHH_rol: true },
    });
    return empleados.map((e) => this.toFrontend(e));
  }

  async findOne(id_empleado: number) {
    const empleado = await this.prisma.rRHH_empleado.findUnique({
      where: { id_empleado },
      include: { RRHH_rol: true },
    });
    if (!empleado) {
      throw new NotFoundException(`Empleado con id ${id_empleado} no encontrado`);
    }
    return this.toFrontend(empleado);
  }

  async update(id_empleado: number, dto: ActualizarEmpleadoDto) {
    await this.findOne(id_empleado);
    const data: {
      nombre?: string;
      correo?: string | null;
      telefono?: string | null;
      estado?: string;
      RRHH_rol?: { connect: { id_rol: number } };
    } = {};
    if (dto.nombre !== undefined) data.nombre = dto.nombre;
    if (dto.correo !== undefined) data.correo = dto.correo;
    if (dto.telefono !== undefined) data.telefono = dto.telefono;
    if (dto.estado !== undefined) data.estado = dto.estado;
    if (dto.id_rol !== undefined) {
      data.RRHH_rol = { connect: { id_rol: dto.id_rol } };
    }
    const empleado = await this.prisma.rRHH_empleado.update({
      where: { id_empleado },
      data,
      include: { RRHH_rol: true },
    });
    return this.toFrontend(empleado);
  }

  async remove(id_empleado: number) {
    await this.findOne(id_empleado);
    const empleado = await this.prisma.rRHH_empleado.update({
      where: { id_empleado },
      data: { estado: 'Inactivo' },
      include: { RRHH_rol: true },
    });
    return this.toFrontend(empleado);
  }

  private toFrontend(e: any) {
    return {
      id_empleado: String(e.id_empleado),
      rut: e.rut,
      nombre: e.nombre,
      id_rol: e.id_rol,
      correo: e.correo,
      telefono: e.telefono,
      estado: e.estado === 'Inactivo' ? 'INACTIVO' : 'ACTIVO',
      name_rol: e.RRHH_rol?.name_rol ?? '',
    };
  }
}
