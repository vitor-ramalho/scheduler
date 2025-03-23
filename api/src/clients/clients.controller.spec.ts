import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';

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
      const clientData = { name: 'John Doe', email: 'john@example.com' };
      const createdClient = { id: '1', ...clientData };

      jest.spyOn(service, 'create').mockResolvedValue(createdClient as any);

      const result = await controller.create(clientData, 'org-id');

      expect(service.create).toHaveBeenCalledWith(clientData, 'org-id');
      expect(result).toEqual(createdClient);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with organizationId and return the result', async () => {
      const clients = [{ id: '1', name: 'John Doe', email: 'john@example.com' }];

      jest.spyOn(service, 'findAll').mockResolvedValue(clients as any);

      const result = await controller.findAll('org-id');

      expect(service.findAll).toHaveBeenCalledWith('org-id');
      expect(result).toEqual(clients);
    });
  });

  describe('update', () => {
    it('should call service.update with organizationId and return the result', async () => {
      const clientData = { name: 'Updated Name' };
      const updatedClient = { id: '1', ...clientData };

      jest.spyOn(service, 'update').mockResolvedValue(updatedClient as any);

      const result = await controller.update('1', clientData, 'org-id');

      expect(service.update).toHaveBeenCalledWith('1', clientData, 'org-id');
      expect(result).toEqual(updatedClient);
    });
  });

  describe('remove', () => {
    it('should call service.remove with organizationId and return the result', async () => {
      const removedClient = { id: '1', name: 'John Doe', email: 'john@example.com' };

      jest.spyOn(service, 'remove').mockResolvedValue(removedClient as any);

      const result = await controller.remove('1', 'org-id');

      expect(service.remove).toHaveBeenCalledWith('1', 'org-id');
      expect(result).toEqual(removedClient);
    });
  });
});
