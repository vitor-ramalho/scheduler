import { GeneratePixDto } from "../providers/dto/generate-pix.dto";

export interface PaymentResponse {
    id: string;
    redirect_url: string;
    status: string;
    amount: number;
    currency: string;
    created_at: string;
}

export interface CreatePaymentDTO {
    amount: number;
    orderId: string;
    currency?: string;
    callbackUrl: string;
    returnUrl: string;
    cancelUrl: string;
}

export interface PaymentProvider {
    createPayment(data: CreatePaymentDTO): Promise<PaymentResponse>;
    getPaymentStatus(paymentId: string): Promise<PaymentResponse>;
    generatePixQrCode(data: GeneratePixDto): Promise<PIXPaymentResponse>;
}

export interface PIXPaymentResponse {
    id: string;
    amount: number;
    status: string;
    devMode: boolean;
    brCode: string;
    brCodeBase64: string;
    platformFee: number;
    createdAt: string;
    updatedAt: string;
    expiresAt: string;
}