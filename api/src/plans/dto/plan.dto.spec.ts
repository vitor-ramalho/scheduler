import { validate } from 'class-validator';
import { PlanDto } from '../src/plans/dto/plan.dto';

describe('PlanDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new PlanDto();
    dto.name = 'Premium Plan';
    dto.description = 'This is a premium plan with advanced features.';
    dto.price = 99.99;
    dto.features = ['Feature 1', 'Feature 2'];

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if name is missing', async () => {
    const dto = new PlanDto();
    dto.description = 'This is a premium plan with advanced features.';
    dto.price = 99.99;
    dto.features = ['Feature 1', 'Feature 2'];

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation if description is missing', async () => {
    const dto = new PlanDto();
    dto.name = 'Premium Plan';
    dto.price = 99.99;
    dto.features = ['Feature 1', 'Feature 2'];

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation if price is missing', async () => {
    const dto = new PlanDto();
    dto.name = 'Premium Plan';
    dto.description = 'This is a premium plan with advanced features.';
    dto.features = ['Feature 1', 'Feature 2'];

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should fail validation if price is not a number', async () => {
    const dto = new PlanDto();
    dto.name = 'Premium Plan';
    dto.description = 'This is a premium plan with advanced features.';
    dto.price = 'invalid' as any;
    dto.features = ['Feature 1', 'Feature 2'];

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should fail validation if features is missing', async () => {
    const dto = new PlanDto();
    dto.name = 'Premium Plan';
    dto.description = 'This is a premium plan with advanced features.';
    dto.price = 99.99;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isArray');
  });

  it('should fail validation if features is not an array', async () => {
    const dto = new PlanDto();
    dto.name = 'Premium Plan';
    dto.description = 'This is a premium plan with advanced features.';
    dto.price = 99.99;
    dto.features = 'invalid' as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isArray');
  });
});