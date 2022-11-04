import { Module } from '@nestjs/common';

import { PubSubService } from './pub-sub.service';

@Module({
  imports: [],
  providers: [PubSubService],
  exports: [PubSubService],
})
export class PubSubModule {}
