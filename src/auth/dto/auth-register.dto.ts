import { IsString, IsEmail, IsStrongPassword } from "class-validator";

export class AuthRegisterDTO {
    @IsString()
    nome: string;

    @IsString()
    nome_empresa: string;

    @IsEmail()
    email: string;

    @IsStrongPassword({
        minLength: 6,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 0,
        minSymbols: 0,
    })
    password: string;
}