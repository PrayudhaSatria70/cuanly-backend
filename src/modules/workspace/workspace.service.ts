import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}

  async findAll(ownerId: string) {
    const members = await this.prisma.workspaceMember.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'asc' },
    });

    return members;
  }

  async addMember(ownerId: string, dto: CreateMemberDto) {
    const id = `mem_${Date.now()}`;
    const member = await this.prisma.workspaceMember.create({
      data: {
        id,
        ownerId,
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        role: dto.role || 'MEMBER',
        status: 'ACTIVE',
      },
    });

    return {
      success: true,
      member,
    };
  }
}
