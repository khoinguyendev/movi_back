import { PartialType } from '@nestjs/mapped-types';
import { CreateSubtitletypeDto } from './create-subtitletype.dto';

export class UpdateSubtitletypeDto extends PartialType(CreateSubtitletypeDto) {}
