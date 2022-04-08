import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret', // TODO: store in ENV
      signOptions: { expiresIn: '1d' },
    }),
  ],
  exports: [JwtModule],
})
export class SharedModule {}
