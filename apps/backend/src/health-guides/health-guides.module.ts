import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthGuidesService } from './health-guides.service';
import { HealthGuidesController } from './health-guides.controller';
import { createSupabaseClient } from '../config/supabase.config';

@Module({
  imports: [ConfigModule],
  controllers: [HealthGuidesController],
  providers: [
    HealthGuidesService,
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: (configService: ConfigService) =>
        createSupabaseClient(configService),
      inject: [ConfigService],
    },
  ],
  exports: [HealthGuidesService],
})
export class HealthGuidesModule {}

