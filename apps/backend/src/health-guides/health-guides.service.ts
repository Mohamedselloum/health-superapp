import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { SupabaseClient } from '../config/supabase.config';
import { CreateHealthGuideDto, UpdateHealthGuideDto } from './dto/health-guide.dto';

@Injectable()
export class HealthGuidesService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async findAll(locale?: string, status?: string) {
    let query = this.supabase
      .from('health_guides')
      .select('*')
      .order('created_at', { ascending: false });

    if (locale) {
      query = query.eq('locale', locale);
    }

    if (status) {
      query = query.eq('status', status);
    } else {
      // Default to published guides for public access
      query = query.eq('status', 'published');
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch health guides: ${error.message}`);
    }

    return data;
  }

  async findOne(id: number) {
    const { data, error } = await this.supabase
      .from('health_guides')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new NotFoundException(`Health guide with ID ${id} not found`);
    }

    return data;
  }

  async findBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from('health_guides')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      throw new NotFoundException(`Health guide with slug ${slug} not found`);
    }

    return data;
  }

  async create(createHealthGuideDto: CreateHealthGuideDto, authorId: string) {
    const { data, error } = await this.supabase
      .from('health_guides')
      .insert({
        ...createHealthGuideDto,
        author_id: authorId,
        status: 'draft',
        version: 1,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create health guide: ${error.message}`);
    }

    return data;
  }

  async update(id: number, updateHealthGuideDto: UpdateHealthGuideDto, editorId: string) {
    // First, get the current guide
    const currentGuide = await this.findOne(id);

    // Create a revision
    await this.supabase
      .from('guide_revisions')
      .insert({
        guide_id: id,
        body_md: currentGuide.body_md,
        version: currentGuide.version,
        editor_id: editorId,
        notes: updateHealthGuideDto.revisionNotes || 'Updated guide content',
      });

    // Update the guide
    const { data, error } = await this.supabase
      .from('health_guides')
      .update({
        ...updateHealthGuideDto,
        version: currentGuide.version + 1,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update health guide: ${error.message}`);
    }

    return data;
  }

  async publish(id: number, reviewerId: string) {
    const { data, error } = await this.supabase
      .from('health_guides')
      .update({
        status: 'published',
        reviewer_id: reviewerId,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to publish health guide: ${error.message}`);
    }

    return data;
  }

  async remove(id: number) {
    const { error } = await this.supabase
      .from('health_guides')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete health guide: ${error.message}`);
    }

    return { message: 'Health guide deleted successfully' };
  }

  async getRevisions(id: number) {
    const { data, error } = await this.supabase
      .from('guide_revisions')
      .select(`
        *,
        editor:profiles!guide_revisions_editor_id_fkey(full_name, email)
      `)
      .eq('guide_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch guide revisions: ${error.message}`);
    }

    return data;
  }

  async search(query: string, locale?: string) {
    let searchQuery = this.supabase
      .from('health_guides')
      .select('*')
      .eq('status', 'published')
      .or(`title_jsonb->>en.ilike.%${query}%,body_md.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (locale) {
      searchQuery = searchQuery.eq('locale', locale);
    }

    const { data, error } = await searchQuery;

    if (error) {
      throw new Error(`Failed to search health guides: ${error.message}`);
    }

    return data;
  }
}

