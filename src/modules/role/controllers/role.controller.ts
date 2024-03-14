import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RoleService } from 'src/modules/role/services/role.service';
import { RoleCreateDto } from '../dtos/role.create.dto';
import { RoleUpdateDto } from '../dtos/role.update.dto';
import { ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

@ApiTags('role')
@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post()
  create(@Body() createDto: RoleCreateDto) {
    return this.roleService.create(createDto);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: RoleUpdateDto) {
    return this.roleService.update(id, updateDto);
  }
  @Get()
  getAllRoles() {
    return this.roleService.getAll();
  }
  @Get(':id')
  getOne(@Param('id') id: Types.ObjectId) {
    return this.roleService.findOneById(id);
  }
}
