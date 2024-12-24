import { UnauthorizedException } from '@nestjs/common';

export class CustomUnauthorizedException extends UnauthorizedException {
  constructor(
    message: string,
    private userId: number,
    statusCode: number,
  ) {
    super({ message, userId, statusCode });
  }

  getUser() {
    return this.userId;
  }
}
