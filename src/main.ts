import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment-timezone';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        // Tạo ra một exception chỉ chứa thông báo lỗi đầu tiên của mỗi trường

        const formattedErrors = errors.map((error) => {
          const constraintKeys = Object.keys(error.constraints);
          const firstConstraintKey = constraintKeys[constraintKeys.length - 1]; // Lấy khóa của lỗi đầu tiên
          const firstErrorMessage = error.constraints[firstConstraintKey]; // Lấy thông báo lỗi đầu tiên

          return {
            field: error.property,
            message: firstErrorMessage, // Hiển thị thông báo lỗi đầu tiên
          };
        });
        throw new BadRequestException(formattedErrors[0].message);
      },
    }),
  );
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://192.168.1.29:3000',
      'http://192.168.1.29:*',
      'http://localhost:3001',
      'http://localhost:5173',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  moment.tz.setDefault('Asia/Ho_Chi_Minh');
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT');
  await app.listen(PORT, '0.0.0.0');
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
