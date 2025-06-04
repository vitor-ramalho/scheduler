import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsUUID()
  planId: string;

  @IsNotEmpty()
  @IsUUID()
  organizationId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}

export class UpdateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  paymentId: string;

  @IsNotEmpty()
  @IsString()
  status: string;
}
