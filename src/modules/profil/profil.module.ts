import { Module } from '@nestjs/common';
import { ProfilController } from './profil.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProfilController],
})
export class ProfilModule {}
