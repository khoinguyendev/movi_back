import { Module } from '@nestjs/common';
import { SubtitletypesService } from './subtitletypes.service';
import { SubtitletypesController } from './subtitletypes.controller';

@Module({
  controllers: [SubtitletypesController],
  providers: [SubtitletypesService],
})
export class SubtitletypesModule {}
