import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { HealthGuidesService } from './health-guides.service';
import { CreateHealthGuideDto, UpdateHealthGuideDto } from './dto/health-guide.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Role } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Health Guides')
@Controller('health-guides')
export class HealthGuidesController {
  constructor(private readonly healthGuidesService: HealthGuidesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all published health guides' })
  @ApiQuery({ name: 'locale', required: false, enum: ['en', 'fr', 'ar'] })
  @ApiResponse({ status: 200, description: 'Health guides retrieved successfully' })
  findAll(@Query('locale') locale?: string) {
    return this.healthGuidesService.findAll(locale, 'published');
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all health guides (admin only)' })
  @ApiQuery({ name: 'locale', required: false, enum: ['en', 'fr', 'ar'] })
  @ApiQuery({ name: 'status', required: false, enum: ['draft', 'review', 'published'] })
  @ApiResponse({ status: 200, description: 'Health guides retrieved successfully' })
  findAllAdmin(@Query('locale') locale?: string, @Query('status') status?: string) {
    return this.healthGuidesService.findAll(locale, status);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search health guides' })
  @ApiQuery({ name: 'q', description: 'Search query' })
  @ApiQuery({ name: 'locale', required: false, enum: ['en', 'fr', 'ar'] })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  search(@Query('q') query: string, @Query('locale') locale?: string) {
    return this.healthGuidesService.search(query, locale);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get health guide by slug' })
  @ApiResponse({ status: 200, description: 'Health guide retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Health guide not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.healthGuidesService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get health guide by ID' })
  @ApiResponse({ status: 200, description: 'Health guide retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Health guide not found' })
  findOne(@Param('id') id: string) {
    return this.healthGuidesService.findOne(+id);
  }

  @Get(':id/revisions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get health guide revisions (admin only)' })
  @ApiResponse({ status: 200, description: 'Guide revisions retrieved successfully' })
  getRevisions(@Param('id') id: string) {
    return this.healthGuidesService.getRevisions(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new health guide (admin only)' })
  @ApiResponse({ status: 201, description: 'Health guide created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createHealthGuideDto: CreateHealthGuideDto, @Request() req) {
    return this.healthGuidesService.create(createHealthGuideDto, req.user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update health guide (admin only)' })
  @ApiResponse({ status: 200, description: 'Health guide updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Health guide not found' })
  update(
    @Param('id') id: string,
    @Body() updateHealthGuideDto: UpdateHealthGuideDto,
    @Request() req,
  ) {
    return this.healthGuidesService.update(+id, updateHealthGuideDto, req.user.sub);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish health guide (admin only)' })
  @ApiResponse({ status: 200, description: 'Health guide published successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Health guide not found' })
  publish(@Param('id') id: string, @Request() req) {
    return this.healthGuidesService.publish(+id, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete health guide (admin only)' })
  @ApiResponse({ status: 200, description: 'Health guide deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Health guide not found' })
  remove(@Param('id') id: string) {
    return this.healthGuidesService.remove(+id);
  }
}

