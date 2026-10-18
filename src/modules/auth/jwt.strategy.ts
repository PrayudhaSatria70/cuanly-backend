import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'cuanly_super_secure_jwt_secret_key_2026_production',
    });
  }

  async validate(payload: JwtPayload) {
    let user: any = null;
    try {
      user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { settings: true },
      });
    } catch {
      // Fallback if database is cold / offline
    }

    if (!user) {
      // If DB is offline, return verified JWT claims as authenticated user object
      return {
        id: payload.sub,
        name: payload.username === 'admin' ? 'Live Administrator' : payload.username,
        username: payload.username,
        email: payload.email,
        role: payload.role,
        subscriptionTier: payload.role === 'ADMIN' ? 'B2B' : 'FREE',
        isActive: true,
      };
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User no longer exists or has been deactivated');
    }

    const { passwordHash, pinHash, ...safeUser } = user;
    return safeUser;
  }
}
