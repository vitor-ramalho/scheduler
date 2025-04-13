import { validate } from 'class-validator';
import { AppointmentDto } from './appointment.dto';

describe('AppointmentDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new AppointmentDto();
    dto.professionalId = 'valid-uuid';
    dto.clientId = 'valid-uuid';
    dto.start = new Date();
    dto.end = new Date(dto.start.getTime() + 60 * 60 * 1000); // 1 hour later
    dto.status = 'scheduled';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation if professionalId is not a UUID', async () => {
    const dto = new AppointmentDto();
    dto.professionalId = 'not-a-uuid';
    dto.clientId = 'valid-uuid';
    dto.start = new Date();
    dto.end = new Date(dto.start.getTime() + 60 * 60 * 1000);
    dto.status = 'scheduled';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('professionalId');
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should fail validation if clientId is not a UUID', async () => {
    const dto = new AppointmentDto();
    dto.professionalId = 'valid-uuid';
    dto.clientId = 'not-a-uuid';
    dto.start = new Date();
    dto.end = new Date(dto.start.getTime() + 60 * 60 * 1000);
    dto.status = 'scheduled';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('clientId');
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should fail validation if start is not a Date', async () => {
    const dto = new AppointmentDto();
    dto.professionalId = 'valid-uuid';
    dto.clientId = 'valid-uuid';
    dto.start = 'not-a-date' as any;
    dto.end = new Date();
    dto.status = 'scheduled';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('start');
    expect(errors[0].constraints).toHaveProperty('isDate');
  });

  it('should fail validation if end is not a Date', async () => {
    const dto = new AppointmentDto();
    dto.professionalId = 'valid-uuid';
    dto.clientId = 'valid-uuid';
    dto.start = new Date();
    dto.end = 'not-a-date' as any;
    dto.status = 'scheduled';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('end');
    expect(errors[0].constraints).toHaveProperty('isDate');
  });

  it('should fail validation if status is not a valid status', async () => {
    const dto = new AppointmentDto();
    dto.professionalId = 'valid-uuid';
    dto.clientId = 'valid-uuid';
    dto.start = new Date();
    dto.end = new Date(dto.start.getTime() + 60 * 60 * 1000);
    dto.status = 'invalid-status' as any;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('status');
    expect(errors[0].constraints).toHaveProperty('isIn');
  });
});