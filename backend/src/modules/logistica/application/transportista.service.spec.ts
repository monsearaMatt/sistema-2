import { Test, TestingModule } from '@nestjs/testing';
import { TransportistaService } from './transportista.service';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CrearTransportistaDto } from '../presentation/dto/crear-transportista.dto';

describe('TransportistaService', () => {
  let service: TransportistaService;

  const mockPrisma = {
    log_transportista: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransportistaService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TransportistaService>(TransportistaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('create should call prisma.create and return result', async () => {
    const dto = { nombre_transp: 'Prueba', patente_vehiculo: 'ABC123', id_empleado: 1 } as CrearTransportistaDto;
    const expected = { id_transportista: 1, ...dto };
    mockPrisma.log_transportista.create.mockResolvedValue(expected);

    const res = await service.create(dto);

    expect(mockPrisma.log_transportista.create).toHaveBeenCalledWith({
      data: {
        nombre_transp: dto.nombre_transp,
        patente_vehiculo: dto.patente_vehiculo,
        RRHH_empleado: { connect: { id_empleado: dto.id_empleado } },
      },
    });
    expect(res).toEqual(expected);
  });

  it('findAll should call prisma.findMany and return result', async () => {
    const expected = [{ id_transportista: 1, nombre_transp: 'Prueba' }];
    mockPrisma.log_transportista.findMany.mockResolvedValue(expected);

    const res = await service.findAll();

    expect(mockPrisma.log_transportista.findMany).toHaveBeenCalledWith({ include: { RRHH_empleado: true } });
    expect(res).toEqual(expected);
  });
});
