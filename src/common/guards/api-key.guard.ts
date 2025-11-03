import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const key = request.headers['x-api-key'] || request.headers['X-API-KEY'];
    if (!key) throw new UnauthorizedException('API key required');
    const expected = process.env.API_KEY || 'super-secret-key';
    if (key !== expected) throw new ForbiddenException('Invalid API key');
    return true;
  }
}
