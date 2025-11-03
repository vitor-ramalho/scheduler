import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { Appointment } from '../appointments/entities/appointment.entity'; // Corrected import path
import { NotFoundException } from '@nestjs/common';

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByIdentifier: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    service = module.get<ClientsService>(ClientsService);
  });

  describe('create', () => {
    it('should call service.create with organizationId and return the result', async () => {
      const clientData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        identifier: '12526555452',
      };
      const createdClient = { id: '1', ...clientData };

      jest.spyOn(service, 'create').mockResolvedValue(createdClient as any);

      const result = await controller.create(clientData, 'org-id');

      expect(service.create).toHaveBeenCalledWith(clientData, 'org-id');
      expect(result).toEqual(createdClient);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with organizationId and return the result', async () => {
      const clients = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          identifier: '12526555452',
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(clients as any);

      const result = await controller.findAll('org-id');

      expect(service.findAll).toHaveBeenCalledWith('org-id');
      expect(result).toEqual(clients);
    });
  });

  describe('findByIdentifier', () => {
    it('should call service.findByIdentifier with identifier and organizationId and return the result', async () => {
      const client = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        identifier: '12526555452',
      };

      jest.spyOn(service, 'findByIdentifier').mockResolvedValue(client as any);

      const result = await controller.findByIdentifier('12526555452', 'org-id');

      expect(service.findByIdentifier).toHaveBeenCalledWith(
        '12526555452',
        'org-id',
      );
      expect(result).toEqual(client);
    });

    it('should throw NotFoundException when client is not found', async () => {
      jest
        .spyOn(service, 'findByIdentifier')
        .mockRejectedValue(new NotFoundException('Client not found'));

      await expect(
        controller.findByIdentifier('nonexistent', 'org-id'),
      ).rejects.toThrow(NotFoundException);
      expect(service.findByIdentifier).toHaveBeenCalledWith(
        'nonexistent',
        'org-id',
      );
    });
  });

  describe('update', () => {
    it('should call service.update with organizationId and return the result', async () => {
      const clientData = {
        name: 'Updated Name',
        email: 'john@example.com',
        phone: '1234567890',
        identifier: '12526555452',
      };
      const updatedClient = { id: '1', ...clientData };

      jest.spyOn(service, 'update').mockResolvedValue(updatedClient as any);

      const result = await controller.update('1', clientData, 'org-id');

      expect(service.update).toHaveBeenCalledWith('1', clientData, 'org-id');
      expect(result).toEqual(updatedClient);
    });

    it('should throw NotFoundException when client to update is not found', async () => {
      const clientData = {
        name: 'Updated Name',
      };

      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new NotFoundException('Client not found'));

      await expect(
        controller.update('nonexistent', clientData, 'org-id'),
      ).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(
        'nonexistent',
        clientData,
        'org-id',
      );
    });
  });

  describe('remove', () => {
    it('should call service.remove with organizationId and return the result', async () => {
      const removedClient = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        identifier: '12526555452',
      };

      jest.spyOn(service, 'remove').mockResolvedValue(removedClient as any);

      const result = await controller.remove('1', 'org-id');

      expect(service.remove).toHaveBeenCalledWith('1', 'org-id');
      expect(result).toEqual(removedClient);
    });

    it('should throw NotFoundException when client to remove is not found', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(new NotFoundException('Client not found'));

      await expect(controller.remove('nonexistent', 'org-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith('nonexistent', 'org-id');
    });
  });
});
