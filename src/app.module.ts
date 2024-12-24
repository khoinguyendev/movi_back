import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TransformInterceptor } from './core/transform.interceptor';
import { RolesGuard } from './auth/role/roles.guard';
import { Movie } from './entities/Movie';
import { Cinema } from './entities/Cinema';
import { Hall } from './entities/Hall';
import { Showtime } from './entities/Showtime';
import { Ticket } from './entities/Ticket';
import { Seat } from './entities/Seat';
import { MoviesModule } from './modules/movies/movies.module';
import { CinemasModule } from './modules/cinemas/cinemas.module';
import { HallsModule } from './modules/halls/halls.module';
import { ShowtimesModule } from './modules/showtimes/showtimes.module';
import { SeatsModule } from './modules/seats/seats.module';
import { TicketsModule } from './modules/tickets/tickets.module';

import { SubtitletypesModule } from './modules/subtitletypes/subtitletypes.module';
import { SubtitleType } from './entities/SubtitleType';
import { UploadModule } from './modules/upload/upload.module';
import { QrcodeModule } from './modules/qrcode/qrcode.module';
import { QRCode } from './entities/QRcode';
import { PaymentMomoModule } from './modules/payment-momo/payment-momo.module';
import { ReviewModule } from './modules/review/review.module';
import { Review } from './entities/Review';
import { AreaModule } from './modules/area/area.module';
import { Area } from './entities/Area';
import { UserPointModule } from './modules/user-point/user-point.module';
import { VoucherModule } from './modules/voucher/voucher.module';
import { UserVoucherModule } from './modules/user-voucher/user-voucher.module';
import { UserPoint } from './entities/UserPoint';
import { Voucher } from './entities/Voucher';
import { UserVoucher } from './entities/UserVoucher';
import { ToppingModule } from './modules/topping/topping.module';
import { Topping } from './entities/Topping';
import { ZaloPaymentModule } from './modules/zalo-payment/zalo-payment.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Serve files from the 'uploads' directory
      serveRoot: '/uploads', // Serve files at '/uploads'
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [
          User,
          Movie,
          Cinema,
          Hall,
          Showtime,
          Ticket,
          Seat,
          Area,
          Review,
          SubtitleType,
          UserPoint,
          Voucher,
          UserVoucher,
          QRCode,
          Topping,
        ],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
      }),
    }),
    UsersModule,
    AuthModule,
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,

          // ignoreTLS: true,
          // secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        // preview: true,
        template: {
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
    MoviesModule,
    CinemasModule,
    HallsModule,
    ShowtimesModule,
    SeatsModule,
    TicketsModule,
    SubtitletypesModule,
    UploadModule,
    QrcodeModule,
    PaymentMomoModule,
    ReviewModule,
    AreaModule,
    UserPointModule,
    VoucherModule,
    UserVoucherModule,
    ToppingModule,
    ZaloPaymentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD, //Cau hinh global bao ve endpoins
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR, //Cau hinh data tra ve
      useClass: TransformInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
