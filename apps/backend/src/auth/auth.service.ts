import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { SupabaseClient } from '../config/supabase.config';
import { SignUpDto, SignInDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password, fullName, phone, locale } = signUpDto;

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw new UnauthorizedException(authError.message);
    }

    // Create profile
    if (authData.user) {
      const { error: profileError } = await this.supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          phone,
          locale: locale || 'en',
          role: 'user',
        });

      if (profileError) {
        // If profile creation fails, we should clean up the auth user
        // In production, this would be handled by database triggers or background jobs
        console.error('Profile creation failed:', profileError);
      }
    }

    return {
      user: authData.user,
      message: 'User created successfully. Please check your email for verification.',
    };
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    // Get user profile
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const payload = {
      sub: data.user.id,
      email: data.user.email,
      role: profile?.role || 'user',
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: data.user.id,
        email: data.user.email,
        profile,
      },
    };
  }

  async validateUser(userId: string) {
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return profile;
  }

  async refreshToken(userId: string) {
    const profile = await this.validateUser(userId);
    
    if (!profile) {
      throw new UnauthorizedException('User not found');
    }

    const payload = {
      sub: userId,
      email: profile.email,
      role: profile.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

