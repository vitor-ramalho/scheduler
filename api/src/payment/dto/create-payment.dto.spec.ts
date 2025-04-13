import { validate } from 'class-validator';
import { CreatePaymentDto } from '../src/payment/dto/create-payment.dto';

describe('CreatePaymentDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new CreatePaymentDto();
    dto.amount = 100;
    dto.currency = 'USD';
    dto.description = 'Test payment';
    dto.paymentMethod = 'credit_card';
    dto.paymentDetails = {
      cardNumber: '1234567890123456',
      expiryMonth: 12,
      expiryYear: 2024,
      cvv: '123',
    };

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with invalid amount', async () => {
    const dto = new CreatePaymentDto();
    dto.amount = -100; 

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should fail validation with invalid currency', async () => {
    const dto = new CreatePaymentDto();
    dto.currency = 'invalid';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isCurrency');
  });

  it('should fail validation with missing payment details for credit card', async () => {
    const dto = new CreatePaymentDto();
    dto.paymentMethod = 'credit_card';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('nestedValidation');
  });

  it('should pass validation without payment details for other payment methods', async () => {
    const dto = new CreatePaymentDto();
    dto.paymentMethod = 'paypal';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});