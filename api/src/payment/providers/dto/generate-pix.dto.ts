export interface GeneratePixDto {
    amount: number,
    expiredIn: number,
    description: string,
    customer: {
        name: string,
        cellphone: string,
        email: string,
        taxId: string,
    }
}