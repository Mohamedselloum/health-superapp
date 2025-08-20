import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { SupabaseClient } from '../config/supabase.config';
import { CreateProductDto, UpdateProductDto, ProductFiltersDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async findAll(filters?: ProductFiltersDto) {
    let query = this.supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    if (filters?.isExpressEligible !== undefined) {
      query = query.eq('is_express_eligible', filters.isExpressEligible);
    }

    if (filters?.minPrice !== undefined) {
      query = query.gte('price_cents', filters.minPrice);
    }

    if (filters?.maxPrice !== undefined) {
      query = query.lte('price_cents', filters.maxPrice);
    }

    if (filters?.inStock) {
      query = query.gt('stock', 0);
    }

    if (filters?.search) {
      // Search in name_jsonb and description_md
      query = query.or(
        `name_jsonb->>en.ilike.%${filters.search}%,description_md.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return data;
  }

  async findOne(id: number) {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return data;
  }

  async findBySku(sku: string) {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('sku', sku)
      .single();

    if (error) {
      throw new NotFoundException(`Product with SKU ${sku} not found`);
    }

    return data;
  }

  async create(createProductDto: CreateProductDto) {
    const { data, error } = await this.supabase
      .from('products')
      .insert(createProductDto)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }

    return data;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { data, error } = await this.supabase
      .from('products')
      .update(updateProductDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }

    return data;
  }

  async remove(id: number) {
    const { error } = await this.supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }

    return { message: 'Product deleted successfully' };
  }

  async updateStock(id: number, quantity: number) {
    const { data, error } = await this.supabase
      .from('products')
      .update({ stock: quantity })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update product stock: ${error.message}`);
    }

    return data;
  }

  async decrementStock(id: number, quantity: number) {
    // First get current stock
    const product = await this.findOne(id);
    
    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    const newStock = product.stock - quantity;
    return this.updateStock(id, newStock);
  }

  async getRecommendations(productId: number, limit: number = 5) {
    // Get the current product to find similar ones
    const currentProduct = await this.findOne(productId);
    
    // Find products with similar tags
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .overlaps('tags', currentProduct.tags || [])
      .neq('id', productId)
      .gt('stock', 0)
      .limit(limit);

    if (error) {
      throw new Error(`Failed to get product recommendations: ${error.message}`);
    }

    return data;
  }

  async getFeatured(limit: number = 10) {
    // For now, return products with highest stock or most popular tags
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .gt('stock', 0)
      .order('stock', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to get featured products: ${error.message}`);
    }

    return data;
  }

  async getExpressEligible() {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('is_express_eligible', true)
      .gt('stock', 0)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get express eligible products: ${error.message}`);
    }

    return data;
  }
}

