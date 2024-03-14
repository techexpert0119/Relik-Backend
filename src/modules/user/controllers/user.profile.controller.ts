import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/modules/user/services/user.service';
import { GetCurrentUser, GetSessionId } from 'src/common/auth/decorators';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { CompleteProfileDto } from '../dtos/complete-profile-dto';
import { UserTokenInfo } from '../../../common/auth/types/user-token-info.type';
import { SessionService } from '../../session/services/session.service';
import EditUserDto from '../dtos/edit-user.dto';
import { ISessionDto } from '../../page/dtos/session.dto';

@ApiTags('user profile')
@Controller()
export class UserProfileController {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService
  ) {}

  @Get('data')
  getUserData(@GetCurrentUser() user: UserTokenInfo) {
    return this.userService.getUserDataById(user.sub);
  }

  @Get('session')
  async getSessions(
    @GetCurrentUser() user: UserTokenInfo,
    @GetSessionId() sessionId?: string
  ): Promise<ISessionDto[]> {
    const res = await this.sessionService.getAllByUserId(user.sub, sessionId);

    return res;
  }

  @Patch('edit')
  editProfile(
    @Body() user: EditUserDto,
    @GetCurrentUser() userToken: UserTokenInfo
  ) {
    return this.userService.editUser(userToken, user);
  }

  @Delete('session/:id')
  removeSession(
    @GetCurrentUser() user: UserTokenInfo,
    @Param('id') id: string
  ) {
    return this.sessionService.removeById(user.sub, id);
  }

  @Post('session/logout-all')
  removeAllOtherSessions(@GetCurrentUser() user: UserTokenInfo) {
    return this.sessionService.removeAllExceptCurrent(user);
  }

  @Post('complete')
  async completeProfile(
    @GetCurrentUser() user: UserTokenInfo,
    @Body() userProfileCreate: CompleteProfileDto,
    @GetSessionId() sessionId?: string
  ) {
    return this.userService.completeProfile(user, userProfileCreate, sessionId);
  }

  @Patch(':id')
  userUpdate(@Param('id') id: String, @Body() userUpdateDto: UserUpdateDto) {
    return this.userService.updateUser(id, userUpdateDto);
  }
}
