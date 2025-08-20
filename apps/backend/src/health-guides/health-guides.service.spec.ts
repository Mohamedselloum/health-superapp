import { Test, TestingModule } from '@nestjs/testing';
import { HealthGuidesService } from './health-guides.service';
import { SupabaseClient } from '@supabase/supabase-js';

describe('HealthGuidesService', () => {
  let service: HealthGuidesService;
  let supabaseClient: SupabaseClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthGuidesService,
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

    service = module.get<HealthGuidesService>(HealthGuidesService);
    supabaseClient = module.get<SupabaseClient>(SupabaseClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of health guides', async () => {
      const mockGuides = [{ id: 1, title: 'Guide 1' }, { id: 2, title: 'Guide 2' }];
      (supabaseClient.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        data: mockGuides,
        error: null,
      });

      const result = await service.findAll();
      expect(result).toEqual(mockGuides);
    });

    it('should throw an error if fetching fails', async () => {
      const mockError = { message: 'Failed to fetch guides' };
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
    it('should return a single health guide', async () => {
      const mockGuide = { id: 1, title: 'Guide 1' };
      (supabaseClient.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({ data: mockGuide, error: null }),
      });

      const result = await service.findOne(1);
      expect(result).toEqual(mockGuide);
    });

    it('should throw an error if guide not found', async () => {
      const mockError = { message: 'Guide not found' };
      (supabaseClient.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({ data: null, error: mockError }),
      });

      await expect(service.findOne(999)).rejects.toThrow(mockError.message);
    });
  });

  describe('create', () => {
    it('should create a new health guide', async () => {
      const newGuide = { title: 'New Guide', content: '...' };
      const createdGuide = { id: 3, ...newGuide };
      (supabaseClient.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({ data: createdGuide, error: null }),
      });

      const result = await service.create(newGuide as any);
      expect(result).toEqual(createdGuide);
    });

    it('should throw an error if creation fails', async () => {
      const newGuide = { title: 'New Guide', content: '...' };
      const mockError = { message: 'Creation failed' };
      (supabaseClient.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({ data: null, error: mockError }),
      });

      await expect(service.create(newGuide as any)).rejects.toThrow(mockError.message);
    });
  });

  describe('update', () => {
    it('should update an existing health guide', async () => {
      const updatedGuide = { id: 1, title: 'Updated Guide' };
      (supabaseClient.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({ data: updatedGuide, error: null }),
      });

      const result = await service.update(1, updatedGuide as any);
      expect(result).toEqual(updatedGuide);
    });

    it('should throw an error if update fails', async () => {
      const updatedGuide = { title: 'Updated Guide' };
      const mockError = { message: 'Update failed' };
      (supabaseClient.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({ data: null, error: mockError }),
      });

      await expect(service.update(1, updatedGuide as any)).rejects.toThrow(mockError.message);
    });
  });

  describe('remove', () => {
    it('should remove a health guide', async () => {
      (supabaseClient.from as jest.Mock).mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({ data: {}, error: null }),
      });

      await service.remove(1);
      expect(supabaseClient.from).toHaveBeenCalledWith('health_guides');
      expect(supabaseClient.from('health_guides').delete).toHaveBeenCalled();
      expect(supabaseClient.from('health_guides').delete().eq).toHaveBeenCalledWith('id', 1);
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

