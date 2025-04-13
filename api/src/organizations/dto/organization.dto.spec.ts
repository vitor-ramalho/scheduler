import { validate } from 'class-validator';
import { OrganizationDto } from '../src/organizations/dto/organization.dto';

describe('OrganizationDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new OrganizationDto();
    dto.name = 'Valid Organization Name';
    dto.slug = 'valid-organization-slug';
    dto.isActive = true;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation if name is empty', async () => {
    const dto = new OrganizationDto();
    dto.name = '';
    dto.slug = 'valid-organization-slug';
    dto.isActive = true;

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation if slug is empty', async () => {
    const dto = new OrganizationDto();
    dto.name = 'Valid Organization Name';
    dto.slug = '';
    dto.isActive = true;

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation if isActive is not a boolean', async () => {
    const dto = new OrganizationDto();
    dto.name = 'Valid Organization Name';
    dto.slug = 'valid-organization-slug';
    dto.isActive = 'true' as any;

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    expect(errors[0].constraints).toHaveProperty('isBoolean');
  });

  it('should fail validation if slug contains invalid characters', async () => {
    const dto = new OrganizationDto();
    dto.name = 'Valid Organization Name';
    dto.slug = 'invalid slug!';
    dto.isActive = true;

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    expect(errors[0].constraints).toHaveProperty('matches');
  });
});