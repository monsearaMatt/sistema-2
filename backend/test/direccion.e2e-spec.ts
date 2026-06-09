import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';

describe('Direccion (e2e)', () => {
  let app: INestApplication;

  const mockPrisma = {
    direccion: {
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

  it('POST /logistica/direcciones -> 201', async () => {
    const dto = { direccion: 'Calle Falsa 123', id_cliente: 42 };
    const created = { id_direccion: 999, ...dto };
    mockPrisma.direccion.create.mockResolvedValue(created);

    const res = await request(app.getHttpServer())
      .post('/logistica/direcciones')
      .send(dto)
      .expect(201);

    expect(res.body).toEqual(created);
    expect(mockPrisma.direccion.create).toHaveBeenCalled();
  });

  it('GET /logistica/direcciones -> 200', async () => {
    const list = [{ id_direccion: 1, direccion: 'Calle 1' }];
    mockPrisma.direccion.findMany.mockResolvedValue(list);

    const res = await request(app.getHttpServer())
      .get('/logistica/direcciones')
      .expect(200);

    expect(res.body).toEqual(list);
    expect(mockPrisma.direccion.findMany).toHaveBeenCalled();
  });
});
