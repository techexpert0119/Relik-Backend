import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AgencyService } from '../services/agency.service';
import { GetCurrentUser } from 'src/common/auth/decorators';
import { UserTokenInfo } from 'src/common/auth/types/user-token-info.type';
import { AgencyCreateDto } from '../dtos/agency.create.dto';
import { AgencyUpdateDto } from '../dtos/agency.update.dto';

@ApiTags('agency')
@Controller()
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  @Get()
  getAgensies(
    @GetCurrentUser() user: UserTokenInfo,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('searchText') searchText: string
  ) {
    return this.agencyService.getAllAgencies(
      user,
      searchText,
      pageSize,
      pageNumber
    );
  }
  @Get(':id')
  getSingleAgency(@Param('id') id: string) {
    return this.agencyService.getOneById(id);
  }
  @Post()
  createAgency(
    @Body() body: AgencyCreateDto,
    @GetCurrentUser() user: UserTokenInfo
  ) {
    return this.agencyService.createAgency(body, user);
  }
  @Delete('remove-admin')
  removeAdmin(@Body() body: { agencyId: string; adminId: string }) {
    return this.agencyService.removeAdmin(body?.agencyId, body?.adminId);
  }
  @Patch(':id')
  updateAgency(@Param('id') id: string, @Body() body: AgencyUpdateDto) {
    return this.agencyService.updateAgency(id, body);
  }
}
