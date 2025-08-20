import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsNumber, 
  IsBoolean, 
  IsArray, 
  IsObject,
  Min,
  IsPositive
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'THERM-001' })
  @IsString()
  sku: string;

  @ApiProperty({ 
    example: { en: 'Digital Thermometer', fr: 'Thermomètre numérique', ar: 'مقياس حرارة رقمي' },
    description: 'Multilingual product name'
  })
  @IsObject()
  name_jsonb: Record<string, string>;

  @ApiProperty({ example: 'Fast and accurate digital thermometer...', required: false })
  @IsOptional()
  @IsString()
  description_md?: string;

  @ApiProperty({ example: 2499, description: 'Price in cents' })
  @IsNumber()
  @IsPositive()
  price_cents: number;

  @ApiProperty({ example: 'USD', default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: ['https://example.com/image1.jpg'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images_jsonb?: string[];

  @ApiProperty({ example: ['health', 'medical', 'thermometer'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ example: 50, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiProperty({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  is_express_eligible?: boolean;

  @ApiProperty({ example: 100, required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  weight_grams?: number;

  @ApiProperty({ 
    example: { length: 10, width: 5, height: 2 }, 
    required: false,
    description: 'Dimensions in centimeters'
  })
  @IsOptional()
  @IsObject()
  dims_cm?: Record<string, number>;
}

export class UpdateProductDto {
  @ApiProperty({ example: 'THERM-001', required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ 
    example: { en: 'Digital Thermometer', fr: 'Thermomètre numérique', ar: 'مقياس حرارة رقمي' },
    description: 'Multilingual product name',
    required: false
  })
  @IsOptional()
  @IsObject()
  name_jsonb?: Record<string, string>;

  @ApiProperty({ example: 'Fast and accurate digital thermometer...', required: false })
  @IsOptional()
  @IsString()
  description_md?: string;

  @ApiProperty({ example: 2499, description: 'Price in cents', required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price_cents?: number;

  @ApiProperty({ example: 'USD', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: ['https://example.com/image1.jpg'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images_jsonb?: string[];

  @ApiProperty({ example: ['health', 'medical', 'thermometer'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ example: 50, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  is_express_eligible?: boolean;

  @ApiProperty({ example: 100, required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  weight_grams?: number;

  @ApiProperty({ 
    example: { length: 10, width: 5, height: 2 }, 
    required: false,
    description: 'Dimensions in centimeters'
  })
  @IsOptional()
  @IsObject()
  dims_cm?: Record<string, number>;
}

export class ProductFiltersDto {
  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isExpressEligible?: boolean;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  inStock?: boolean;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  search?: string;
}

