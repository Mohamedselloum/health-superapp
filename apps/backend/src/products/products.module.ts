import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { createSupabaseClient } from '../config/supabase.config';

@Module({
  imports: [ConfigModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: (configService: ConfigService) =>
        createSupabaseClient(configService),
      inject: [ConfigService],
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}

