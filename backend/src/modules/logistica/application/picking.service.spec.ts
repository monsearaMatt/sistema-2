import { Test, TestingModule } from '@nestjs/testing';
import { PickingService } from './picking.service';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CrearPickingDto } from '../presentation/dto/crear-picking.dto';

describe('PickingService', () => {
  let service: PickingService;

  const mockPrisma = {
    log_picking: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PickingService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PickingService>(PickingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('create should call prisma.create and return result', async () => {
    const dto = {
      id_pedido_venta: 2001,
      estado: 'Pendiente',
    } as CrearPickingDto;
    const expected = { id_ot: 1, ...dto };
    mockPrisma.log_picking.create.mockResolvedValue(expected);

    const res = await service.create(dto);

    expect(mockPrisma.log_picking.create).toHaveBeenCalled();
    expect(res).toEqual(expected);
  });

  it('assign should update picking and return result', async () => {
    const expected = { id_ot: 1, id_empleado: 5, estado: 'En Proceso' };
    mockPrisma.log_picking.update.mockResolvedValue(expected);

    const res = await service.assign(1, 5);

    expect(mockPrisma.log_picking.update).toHaveBeenCalledWith({
      where: { id_ot: 1 },
      data: { id_empleado: 5, estado: 'En Proceso' },
    });
    expect(res).toEqual(expected);
  });

  it('complete should update status to Completado', async () => {
    const expected = { id_ot: 1, estado: 'Completado' };
    mockPrisma.log_picking.update.mockResolvedValue(expected);

    const res = await service.complete(1);

    expect(mockPrisma.log_picking.update).toHaveBeenCalledWith({
      where: { id_ot: 1 },
      data: { estado: 'Completado' },
    });
    expect(res).toEqual(expected);
  });

  it('findAll should return list', async () => {
    const expected = [{ id_ot: 1 }];
    mockPrisma.log_picking.findMany.mockResolvedValue(expected);

    const res = await service.findAll();

    expect(mockPrisma.log_picking.findMany).toHaveBeenCalled();
    expect(res).toEqual(expected);
  });
});
