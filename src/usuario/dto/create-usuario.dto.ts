import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class CreateUsuarioDTO {
    
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