import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let supabaseClient: SupabaseClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: SupabaseClient,
          useValue: {
            auth: {
              signUp: jest.fn(),
              signInWithPassword: jest.fn(),
              signOut: jest.fn(),
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'SUPABASE_URL') return 'http://mock-supabase.com';
              if (key === 'SUPABASE_ANON_KEY') return 'mock-anon-key';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    supabaseClient = module.get<SupabaseClient>(SupabaseClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should successfully sign up a user', async () => {
      const mockUser = { email: 'test@example.com', password: 'password123' };
      (supabaseClient.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: { id: '123', email: mockUser.email } },
        error: null,
      });

      const result = await service.signUp(mockUser.email, mockUser.password);
      expect(result.user).toBeDefined();
      expect(result.user.email).toEqual(mockUser.email);
      expect(supabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: mockUser.email,
        password: mockUser.password,
      });
    });

    it('should throw an error if sign up fails', async () => {
      const mockUser = { email: 'test@example.com', password: 'password123' };
      const mockError = { message: 'Sign up failed' };
      (supabaseClient.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: mockError,
      });

      await expect(service.signUp(mockUser.email, mockUser.password)).rejects.toThrow(mockError.message);
    });
  });

  describe('signIn', () => {
    it('should successfully sign in a user', async () => {
      const mockUser = { email: 'test@example.com', password: 'password123' };
      (supabaseClient.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { session: { access_token: 'mock-token' } },
        error: null,
      });

      const result = await service.signIn(mockUser.email, mockUser.password);
      expect(result.access_token).toBeDefined();
      expect(supabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: mockUser.email,
        password: mockUser.password,
      });
    });

    it('should throw an error if sign in fails', async () => {
      const mockUser = { email: 'test@example.com', password: 'password123' };
      const mockError = { message: 'Sign in failed' };
      (supabaseClient.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { session: null },
        error: mockError,
      });

      await expect(service.signIn(mockUser.email, mockUser.password)).rejects.toThrow(mockError.message);
    });
  });

  describe('signOut', () => {
    it('should successfully sign out a user', async () => {
      (supabaseClient.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      await service.signOut();
      expect(supabaseClient.auth.signOut).toHaveBeenCalled();
    });

    it('should throw an error if sign out fails', async () => {
      const mockError = { message: 'Sign out failed' };
      (supabaseClient.auth.signOut as jest.Mock).mockResolvedValue({
        error: mockError,
      });

      await expect(service.signOut()).rejects.toThrow(mockError.message);
    });
  });
});

