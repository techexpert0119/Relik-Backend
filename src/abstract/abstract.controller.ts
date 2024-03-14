import { Body, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GetSingleDto } from './dto/get-single.dto';
import { Paginate } from './dto/pagination.dto';
import type { AbstractControllerOptions } from './interfaces/abstract-controller-options.interface';

export function buildController<T, C, V>(
  options: AbstractControllerOptions<T, C, V>
): any {
  const { createDto, model, name, updateDto } = options;

  @ApiTags(name)
  @ApiExtraModels(Paginate, model)
  abstract class AbstractController<CreateDto = any, UpdateDto = any> {
    constructor(private readonly service: any) {}

    @Get()
    @ApiOkResponse({ type: model, isArray: true })
    async findAll(@Query() queryParam): Promise<T[]> {
      const res = await this.service.findAll(queryParam);
      return res;
    }

    @ApiBody({
      type: createDto,
      description: 'Data for model creation',
      required: true,
      isArray: false,
    })
    @ApiOkResponse({ type: model })
    @Post()
    create(@Body() createDto: CreateDto) {
      return this.service.create(createDto);
    }

    @Get(':id')
    @ApiOkResponse({ type: model })
    findOne(@Param('id') id: string, @Query() queryParam: GetSingleDto) {
      return this.service.findOne(id, queryParam);
    }

    @Patch(':id')
    @ApiOkResponse({ type: model })
    @ApiBody({
      type: updateDto,
      description: 'Data for model creation',
      required: true,
      isArray: false,
    })
    update(@Param('id') id: string, @Body() updateUserDto: UpdateDto) {
      return this.service.update(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOkResponse({ type: model })
    remove(@Param('id') id: string) {
      return this.service.remove(id);
    }
  }

  return AbstractController;
}
