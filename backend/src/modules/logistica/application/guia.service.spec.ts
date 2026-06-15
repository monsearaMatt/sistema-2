import { Test, TestingModule } from '@nestjs/testing';
import { GuiaService } from './guia.service';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CrearGuiaDespachoDto } from '../presentation/dto/crear-guia-despacho.dto';

describe('GuiaService', () => {
  let service: GuiaService;

  const mockPrisma = {
    log_guia_despacho: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuiaService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<GuiaService>(GuiaService);
  });

  afterEach(() => jest.clearAllMocks());

  it('create should call prisma.create and return created guia', async () => {
    const dto = {
      id_ot: 1,
      id_transportista: 2,
      id_direccion: 3,
    };
    const created = { id_guia: 10, ...dto };
    mockPrisma.log_guia_despacho.create.mockResolvedValue(created);

    const res = await service.create(dto);

    expect(mockPrisma.log_guia_despacho.create).toHaveBeenCalledWith({
      data: {
        log_picking: { connect: { id_ot: dto.id_ot } },
        log_transportista: {
          connect: { id_transportista: dto.id_transportista },
        },
        direccion: { connect: { id_direccion: dto.id_direccion } },
      },
    });
    expect(res).toEqual(created);
  });

  it('findAll should call prisma.findMany with includes', async () => {
    const list = [{ id_guia: 1 }];
    mockPrisma.log_guia_despacho.findMany.mockResolvedValue(list);

    const res = await service.findAll();

    expect(mockPrisma.log_guia_despacho.findMany).toHaveBeenCalledWith({
      include: { direccion: true, log_picking: true, log_transportista: true },
    });
    expect(res).toEqual(list);
  });
});
