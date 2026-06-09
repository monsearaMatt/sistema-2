import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';

describe('Picking (e2e)', () => {
  let app: INestApplication;

  const mockPrisma = {
    log_picking: {
      create: jest.fn(),
      update: jest.fn(),
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

  it('POST /logistica/pickings -> 201', async () => {
    const dto = { id_pedido_venta: 5001 };
    const created = { id_ot: 777, ...dto, fecha_creacion: new Date().toISOString(), estado: 'Pendiente' };
    mockPrisma.log_picking.create.mockResolvedValue(created);

    const res = await request(app.getHttpServer())
      .post('/logistica/pickings')
      .send(dto)
      .expect(201);

    expect(res.body).toBeDefined();
    expect(mockPrisma.log_picking.create).toHaveBeenCalled();
  });

  it('PATCH /logistica/pickings/:id/assign -> 200', async () => {
    const updated = { id_ot: 1, id_empleado: 5, estado: 'En Proceso' };
    mockPrisma.log_picking.update.mockResolvedValue(updated);

    const res = await request(app.getHttpServer())
      .patch('/logistica/pickings/1/assign')
      .send({ id_empleado: 5 })
      .expect(200);

    expect(res.body).toEqual(updated);
    expect(mockPrisma.log_picking.update).toHaveBeenCalled();
  });

  it('PATCH /logistica/pickings/:id/complete -> 200', async () => {
    const updated = { id_ot: 1, estado: 'Completado' };
    mockPrisma.log_picking.update.mockResolvedValue(updated);

    const res = await request(app.getHttpServer())
      .patch('/logistica/pickings/1/complete')
      .expect(200);

    expect(res.body).toEqual(updated);
    expect(mockPrisma.log_picking.update).toHaveBeenCalled();
  });

  it('GET /logistica/pickings -> 200', async () => {
    const list = [{ id_ot: 1, estado: 'Pendiente' }];
    mockPrisma.log_picking.findMany.mockResolvedValue(list);

    const res = await request(app.getHttpServer())
      .get('/logistica/pickings')
      .expect(200);

    expect(res.body).toEqual(list);
    expect(mockPrisma.log_picking.findMany).toHaveBeenCalled();
  });
});
