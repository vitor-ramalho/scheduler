import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreatePaymentDTO {
    @IsNotEmpty()
    @IsNumber()
    amount: number

    @IsNotEmpty()
    @IsNumber()
    expiredIn: number

    @IsNotEmpty()
    @IsNumber()
    description: string

    @IsNotEmpty()
    @IsString()
    userId: string

    @IsNotEmpty()
    @IsString()
    organizationId: string
}