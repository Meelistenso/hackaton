import { Module } from '@nestjs/common';
import { InMemoryStorageService } from './in-memory-storage.service';

@Module({
  providers: [InMemoryStorageService],
  exports: [InMemoryStorageService],
})
export class InMemoryStorageModule {}
