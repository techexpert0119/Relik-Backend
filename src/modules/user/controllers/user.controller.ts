import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/modules/user/services/user.service';
import { GetCurrentUser, Public } from 'src/common/auth/decorators';
import { ENUM_ROLE_TYPE } from 'src/modules/role/constants/role.enum.constant';
import { UserTokenInfo } from 'src/common/auth/types/user-token-info.type';

@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users-by-role')
  getCreatedUsersByRole(
    @Query('userId') userId: string,
    @Query('roleName') roleName: ENUM_ROLE_TYPE,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('searchText') searchText: string,
    @GetCurrentUser() user
  ) {
    return this.userService.getCreatedUserByRole(
      roleName,
      user,
      userId,
      pageNumber,
      pageSize,
      searchText
    );
  }
  @Get('resend-verification-email')
  sendVerificationEmail(@GetCurrentUser() user: UserTokenInfo) {
    return this.userService.resendVerificationToken(user);
  }
  @Public()
  @Post('verify-email')
  verifyEmailByToken(@Body() body: { token: string }) {
    return this.userService.verifyEmailForRegistration(body?.token);
  }

  @Get(':id')
  getSingleUserById(@Param('id') id: string) {
    return this.userService.getUserDataById(id);
  }
  @Patch('change-account')
  changeAccount(
    @GetCurrentUser() user: UserTokenInfo,
    @Body() body: { accountId: string }
  ) {
    return this.userService.changeAccount(user, body.accountId);
  }
  @Public()
  @Post('assign-user-to-agency')
  assignUserToAgency(@Body() body: { token: string }) {
    return this.userService.addUserToAgency(body?.token);
  }
}
