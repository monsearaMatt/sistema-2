import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';

describe('Transportista (e2e)', () => {
  let app: INestApplication;

  const mockPrisma = {
    log_transportista: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  } as any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  it('POST /logistica/transportistas -> 201', async () => {
    const dto = { nombre_transp: 'Test Transp', patente_vehiculo: 'ZZZZ11', id_empleado: 1 };
    const created = { id_transportista: 123, ...dto };
    mockPrisma.log_transportista.create.mockResolvedValue(created);

    const res = await request(app.getHttpServer())
      .post('/logistica/transportistas')
      .send(dto)
      .expect(201);

    expect(res.body).toEqual(created);
    expect(mockPrisma.log_transportista.create).toHaveBeenCalled();
  });

  it('GET /logistica/transportistas -> 200', async () => {
    const list = [{ id_transportista: 1, nombre_transp: 'T1' }];
    mockPrisma.log_transportista.findMany.mockResolvedValue(list);

    const res = await request(app.getHttpServer())
      .get('/logistica/transportistas')
      .expect(200);

    expect(res.body).toEqual(list);
    expect(mockPrisma.log_transportista.findMany).toHaveBeenCalledWith({ include: { RRHH_empleado: true } });
  });
});
