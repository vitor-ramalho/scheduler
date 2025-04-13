import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../src/payment/payment.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from '../src/payment/entities/payment.entity'; // Assuming you have a Payment entity

describe('PaymentService', () => {
  let service: PaymentService;
  let repository: Repository<Payment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(Payment),
          useClass: Repository, // Use the actual repository class
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    repository = module.get<Repository<Payment>>(getRepositoryToken(Payment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Example test case - replace with actual methods and logic
  it('should create a payment', async () => {
    const paymentData = { amount: 100, currency: 'USD' }; // Replace with actual data
    const createdPayment = { id: '1', ...paymentData }; // Mock created payment

    jest.spyOn(repository, 'create').mockReturnValue(createdPayment as any); // Mock create method
    jest.spyOn(repository, 'save').mockResolvedValue(createdPayment as any);   // Mock save method

    const result = await service.create(paymentData as any); // Replace with actual method call
    expect(result).toEqual(createdPayment);
    expect(repository.create).toHaveBeenCalledWith(paymentData);
    expect(repository.save).toHaveBeenCalledWith(createdPayment);
  });

  // Add more test cases for other methods like findOne, findAll, update, remove, etc.
  // Ensure to mock repository methods and test different scenarios and edge cases.
});