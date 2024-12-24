import { Injectable } from '@nestjs/common';
import { CreateSubtitletypeDto } from './dto/create-subtitletype.dto';
import { UpdateSubtitletypeDto } from './dto/update-subtitletype.dto';

@Injectable()
export class SubtitletypesService {
  create(createSubtitletypeDto: CreateSubtitletypeDto) {
    return 'This action adds a new subtitletype';
  }

  findAll() {
    return `This action returns all subtitletypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subtitletype`;
  }

  update(id: number, updateSubtitletypeDto: UpdateSubtitletypeDto) {
    return `This action updates a #${id} subtitletype`;
  }

  remove(id: number) {
    return `This action removes a #${id} subtitletype`;
  }
}
