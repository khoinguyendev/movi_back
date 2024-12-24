import { Module } from '@nestjs/common';
import { ControllerController } from './controller/controller.controller';
import { ServiceService } from './service/service.service';
import { UserController } from './user/user.controller';
import { UserController } from './cotrollers/user/user.controller';
import { UserService } from './service/user/user.service';

@Module({
  controllers: [ControllerController, UserController],
  providers: [ ServiceService, UserService]
})
export class UserModule {}
