import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(10)
  password: string;

  @IsOptional()
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  address: string;

  @IsOptional()
  accountType: string;

  @IsOptional()
  role: string;
  @IsOptional()
  isActive: boolean;
}
