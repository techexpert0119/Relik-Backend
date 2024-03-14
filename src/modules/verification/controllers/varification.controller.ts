import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VerificationService } from '../services/verification.service';
import { GetCurrentUser, Public } from 'src/common/auth/decorators';
import { UserTokenInfo } from 'src/common/auth/types/user-token-info.type';
import { ENUM_VERIFICATION_PURPOSE } from '../constants/varification.enum.constant';

@ApiTags('verification')
@Controller()
export class VerificationController {
  constructor(private readonly varificationService: VerificationService) {}
  @Get()
  getInvitationsOfUser(
    @GetCurrentUser() user: UserTokenInfo,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('searchText') searchText: string
  ) {
    return this.varificationService.getAllValidationsOfUser(
      user,
      pageNumber,
      pageSize,
      searchText
    );
  }
  @Post('resend')
  resendInvitation(
    @Body() body: { id: string; purpose: ENUM_VERIFICATION_PURPOSE }
  ) {
    return this.varificationService.resend(body.id);
  }
  @Delete()
  deleteInvitation(@Body() body: { id: string }) {
    return this.varificationService.delete(body.id);
  }

  @Public()
  @Post()
  validateInvitation(@Body() body: { token: string }) {
    return this.varificationService.validateValidation(body?.token);
  }
}
