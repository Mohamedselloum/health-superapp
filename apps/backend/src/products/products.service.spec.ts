import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { SupabaseClient } from '@supabase/supabase-js';

describe('ProductsService', () => {
  let service: ProductsService;
  let supabaseClient: SupabaseClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: SupabaseClient,
          useValue: {
            from: jest.fn(() => ({
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              order: jest.fn().mockReturnThis(),
              insert: jest.fn().mockReturnThis(),
              update: jest.fn().mockReturnThis(),
              delete: jest.fn().mockReturnThis(),
              single: jest.fn().mockReturnThis(),
              data: [],
              error: null,
            })),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    supabaseClient = module.get<SupabaseClient>(SupabaseClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const mockProducts = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
      (supabaseClient.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        data: mockProducts,
        error: null,
      });

      const result = await service.findAll();
      expect(result).toEqual(mockProducts);
    });

    it('should throw an error if fetching fails', async () => {
      const mockError = { message: 'Failed to fetch products' };
      (supabaseClient.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        data: null,
        error: mockError,
      });

      await expect(service.findAll()).rejects.toThrow(mockError.message);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const mockProduct = { id: 1, name: 'Product 1' };
      (supabaseClient.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({ data: mockProduct, error: null }),
      });

      const result = await service.findOne(1);
      expect(result).toEqual(mockProduct);
    });

    it('should throw an error if product not found', async () => {
      const mockError = { message: 'Product not found' };
      (supabaseClient.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({ data: null, error: mockError }),
      });

      await expect(service.findOne(999)).rejects.toThrow(mockError.message);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const newProduct = { name: 'New Product', price: 10 };
      const createdProduct = { id: 3, ...newProduct };
      (supabaseClient.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({ data: createdProduct, error: null }),
      });

      const result = await service.create(newProduct as any);
      expect(result).toEqual(createdProduct);
    });

    it('should throw an error if creation fails', async () => {
      const newProduct = { name: 'New Product', price: 10 };
      const mockError = { message: 'Creation failed' };
      (supabaseClient.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({ data: null, error: mockError }),
      });

      await expect(service.create(newProduct as any)).rejects.toThrow(mockError.message);
    });
  });

  describe('update', () => {
    it('should update an existing product', async () => {
      const updatedProduct = { id: 1, name: 'Updated Product' };
      (supabaseClient.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({ data: updatedProduct, error: null }),
      });

      const result = await service.update(1, updatedProduct as any);
      expect(result).toEqual(updatedProduct);
    });

    it('should throw an error if update fails', async () => {
      const updatedProduct = { name: 'Updated Product' };
      const mockError = { message: 'Update failed' };
      (supabaseClient.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({ data: null, error: mockError }),
      });

      await expect(service.update(1, updatedProduct as any)).rejects.toThrow(mockError.message);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      (supabaseClient.from as jest.Mock).mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({ data: {}, error: null }),
      });

      await service.remove(1);
      expect(supabaseClient.from).toHaveBeenCalledWith('products');
      expect(supabaseClient.from('products').delete).toHaveBeenCalled();
      expect(supabaseClient.from('products').delete().eq).toHaveBeenCalledWith('id', 1);
    });

    it('should throw an error if removal fails', async () => {
      const mockError = { message: 'Removal failed' };
      (supabaseClient.from as jest.Mock).mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({ data: null, error: mockError }),
      });

      await expect(service.remove(1)).rejects.toThrow(mockError.message);
    });
  });
});

