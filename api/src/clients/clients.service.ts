import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { ClientDto } from './dto/client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  create(clientData: ClientDto, organizationId: string) {
    const client = this.clientRepository.create({
      ...clientData,
      organization: { id: organizationId },
    });
    return this.clientRepository.save(client);
  }

  findAll(organizationId: string) {
    return this.clientRepository.find({
      where: { organization: { id: organizationId } },
    });
  }

  async findByIdentifier(identifier: string, organizationId: string) {
    console.log('client', { identifier, organizationId });
    const client = await this.clientRepository.findOneBy({
      identifier,
      organization: { id: organizationId },
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }

  async update(
    id: string,
    clientData: Partial<Client>,
    organizationId: string,
  ) {
    const client = await this.clientRepository.findOne({
      where: { id, organization: { id: organizationId } },
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    Object.assign(client, clientData);
    return this.clientRepository.save(client);
  }

  async remove(id: string, organizationId: string) {
    const client = await this.clientRepository.findOne({
      where: { id, organization: { id: organizationId } },
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return this.clientRepository.remove(client);
  }
}
