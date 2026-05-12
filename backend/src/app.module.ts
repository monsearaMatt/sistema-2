import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RrhhModule } from './modules/rrhh/rrhh.module';
import { LogisticaModule } from './modules/logistica/logistica.module';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
  imports: [RrhhModule, LogisticaModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
