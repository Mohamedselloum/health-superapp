import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';

export enum LocaleType {
  EN = 'en',
  FR = 'fr',
  AR = 'ar',
}

export enum GuideStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  PUBLISHED = 'published',
}

export class CreateHealthGuideDto {
  @ApiProperty({ example: 'common-cold-care' })
  @IsString()
  slug: string;

  @ApiProperty({ 
    example: { en: 'Common Cold Care', fr: 'Soins du rhume', ar: 'علاج نزلة البرد' },
    description: 'Multilingual title object'
  })
  @IsObject()
  title_jsonb: Record<string, string>;

  @ApiProperty({ example: '# Common Cold Care\n\nThis guide covers...' })
  @IsString()
  body_md: string;

  @ApiProperty({ enum: LocaleType, example: LocaleType.EN })
  @IsEnum(LocaleType)
  locale: LocaleType;
}

export class UpdateHealthGuideDto {
  @ApiProperty({ example: 'common-cold-care', required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ 
    example: { en: 'Common Cold Care', fr: 'Soins du rhume', ar: 'علاج نزلة البرد' },
    description: 'Multilingual title object',
    required: false
  })
  @IsOptional()
  @IsObject()
  title_jsonb?: Record<string, string>;

  @ApiProperty({ example: '# Common Cold Care\n\nThis guide covers...', required: false })
  @IsOptional()
  @IsString()
  body_md?: string;

  @ApiProperty({ enum: LocaleType, example: LocaleType.EN, required: false })
  @IsOptional()
  @IsEnum(LocaleType)
  locale?: LocaleType;

  @ApiProperty({ enum: GuideStatus, example: GuideStatus.DRAFT, required: false })
  @IsOptional()
  @IsEnum(GuideStatus)
  status?: GuideStatus;

  @ApiProperty({ example: 'Updated content and formatting', required: false })
  @IsOptional()
  @IsString()
  revisionNotes?: string;
}

