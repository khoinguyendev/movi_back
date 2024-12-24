import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Request,
  UploadedFiles,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions } from 'src/configs/file-upload.config';
import { UsersService } from '../users/users.service';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly userService: UsersService,
  ) {}

  @Post('/avatar')
  @ResponseMessage('Avatar updated successfully')
  @UseInterceptors(FileInterceptor('image', fileUploadOptions('avatar')))
  async create(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const updateUserDto = new UpdateUserDto();
    updateUserDto.avatar = file.filename;
    await this.userService.update(req.user.id, updateUserDto);
    return {
      avatarUrl: file.filename,
    };
  }
  @Post('/comment')
  @UseInterceptors(FilesInterceptor('images', 3, fileUploadOptions('comment')))
  async uploadComent(
    @Request() req,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }
    const fileNames = files.map((file) => file.filename);
    return {
      uploadedFiles: fileNames,
    };
  }
  @Post('/topping')
  @ResponseMessage('Avatar updated successfully')
  @UseInterceptors(FileInterceptor('image', fileUploadOptions('topping')))
  async uploadTopping(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return {
      avatarUrl: file.filename,
    };
  }
  @Get()
  findAll() {
    return this.uploadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUploadDto: UpdateUploadDto) {
    return this.uploadService.update(+id, updateUploadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadService.remove(+id);
  }
}
