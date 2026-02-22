import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class LoginAuthDto{
    @ApiProperty({description: 'Ingrese un correo válido', default: "admin@gmail.com", example: "user@mail.com"})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({description: 'Ingrese una contraseña válida'})
    @MinLength(6)
    @MaxLength(25)  
    @IsNotEmpty()
    password: string;
}