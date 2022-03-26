import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db', // represents db service in Dockerfile
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'ambassador',
      // entities: [],
      autoLoadEntities: true, // only for dev
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
