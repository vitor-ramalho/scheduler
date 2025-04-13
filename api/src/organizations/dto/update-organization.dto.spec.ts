import { validate } from 'class-validator';
import { OrganizationDto } from '../organization.dto';

describe('OrganizationDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new OrganizationDto();
    dto.name = 'Valid Organization';
    dto.slug = 'valid-organization';
    dto.plan = 'basic';
    dto.isActive = true;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with missing name', async () => {
    const dto = new OrganizationDto();
    dto.slug = 'valid-organization';
    dto.plan = 'basic';
    dto.isActive = true;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation with missing slug', async () => {
    const dto = new OrganizationDto();
    dto.name = 'Valid Organization';
    dto.plan = 'basic';
    dto.isActive = true;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation with missing plan', async () => {
    const dto = new OrganizationDto();
    dto.name = 'Valid Organization';
    dto.slug = 'valid-organization';
    dto.isActive = true;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation with missing isActive', async () => {
    const dto = new OrganizationDto();
    dto.name = 'Valid Organization';
    dto.slug = 'valid-organization';
    dto.plan = 'basic';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isBoolean');
  });

  it('should fail validation with invalid slug format', async () => {
    const dto = new OrganizationDto();
    dto.name = 'Valid Organization';
    dto.slug = 'Invalid Slug'; // Contains space
    dto.plan = 'basic';
    dto.isActive = true;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('matches');
  });
});