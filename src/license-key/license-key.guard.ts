import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/constants/jwt';
import { LicenseKeyService } from './license-key.service';

@Injectable()
export class LicenseKeyGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly licenseKeyService: LicenseKeyService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers

      const licenseKey = await this.licenseKeyService.findById(payload['sub']);

      if (!licenseKey) {
        throw new UnauthorizedException();
      }

      request['licenseKey'] = licenseKey;
    } catch {
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
