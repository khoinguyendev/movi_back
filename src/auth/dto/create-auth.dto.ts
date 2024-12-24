import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  username: string;
}

export class verifyAuthDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  code: string;
}
export class getCodeDto {
  @IsNotEmpty()
  email: string;
}
export class forGotPasswordDto {
  @IsNotEmpty()
  email: string;
}
export class resetPasswordDto {
  @IsNotEmpty()
  code: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  email: string;
}
