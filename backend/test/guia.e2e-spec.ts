import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';

describe('Guia (e2e)', () => {
  let app: INestApplication;

  const mockPrisma = {
    log_guia_despacho: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  } as any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] })
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

  it('POST /logistica/guias -> 201', async () => {
    const dto = { id_ot: 1, id_transportista: 2, id_direccion: 3 };
    const created = { id_guia: 99, ...dto };
    mockPrisma.log_guia_despacho.create.mockResolvedValue(created);

    const res = await request(app.getHttpServer())
      .post('/logistica/guias')
      .send(dto)
      .expect(201);

    expect(res.body).toEqual(created);
    expect(mockPrisma.log_guia_despacho.create).toHaveBeenCalled();
  });

  it('GET /logistica/guias -> 200', async () => {
    const list = [{ id_guia: 1 }];
    mockPrisma.log_guia_despacho.findMany.mockResolvedValue(list);

    const res = await request(app.getHttpServer()).get('/logistica/guias').expect(200);

    expect(res.body).toEqual(list);
    expect(mockPrisma.log_guia_despacho.findMany).toHaveBeenCalled();
  });
});
