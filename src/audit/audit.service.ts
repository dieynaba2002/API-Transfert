import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuditService {
    private readonly logger = new Logger('audit');
    
    async log(action: string, payload: any) {
        this.logger.log(`${action} ${JSON.stringify(payload)}`);
    }
}
