import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET_ADMIN } from 'src/constants/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {
    //
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET_ADMIN,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
    } catch (e) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const headers = request.headers;

    if (headers['authorization']) {
      const [type, token] = headers['authorization'].split(' ') ?? [];
      return type === 'Bearer' ? token : null;
    }
    return null;
  }
}
