import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/modules/user/services/user.service';
import { UserLoginDto } from '../dtos/user.login.dto';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from 'src/common/auth/decorators';
import { UserSignUpDto } from '../dtos/user.sign-up.dto';
import { AuthGuard } from '@nestjs/passport';
import { ENUM_USER_SIGN_UP_FROM } from '../constants/user.enum.constant';
import AuthenticationResultDto from '../dtos/authentication-result.dto';
import { UserCreateByInvitationDto } from '../dtos/user.create-by-invitation.dto';
import { UserTokenInfo } from 'src/common/auth/types/user-token-info.type';
import { UserInviteDto } from '../dtos/user.invite.dto';
import { TokenType } from '../../../common/auth/enums/token-type.enum';
import { UserPasswordResetDto } from '../dtos/user.reset-password.dto';

@ApiTags('auth')
@Controller({ version: '1', path: '/user' })
export class UserAuthController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('signup')
  async signUpUser(@Body() userSignUpDto: UserSignUpDto) {
    return await this.userService.signUp(userSignUpDto);
  }

  @Public()
  @Post('login')
  async signInUser(
    @Body() userLoginDto: UserLoginDto
  ): Promise<AuthenticationResultDto> {
    return await this.userService.signIn(userLoginDto);
  }

  @Post('reset-password')
  async resetPassword(
    @GetCurrentUser() user: UserTokenInfo,
    @Body() userResetPasswordDto: UserPasswordResetDto
  ) {
    return await this.userService.resetPassword(user, userResetPasswordDto);
  }

  @Post('logout')
  async logoutUser(@GetCurrentUserId() id: string) {
    return await this.userService.logout(id);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refreshToken(@Req() req) {
    if (req.user.tokenType !== TokenType.Refresh)
      throw new BadRequestException('Wrong type of token');

    return await this.userService.refresh(req.user?.sub, req.user?.sessionId);
  }

  @Public()
  @Post('google')
  async googleAuthRedirect(@Body() body) {
    return this.userService.socialLogin(body, ENUM_USER_SIGN_UP_FROM.GOOGLE);
  }

  @Public()
  @Post('/facebook')
  async facebookLoginRedirect(@Body() body) {
    return this.userService.socialLogin(body, ENUM_USER_SIGN_UP_FROM.FACEBOOK);
  }

  @Public()
  @Get('/twitter')
  twitterRequestToken(@Req() req, @Res() res) {
    return this.userService.getTwitterUserAuth(req, res);
  }

  @Post('invite-user')
  userOrInviteCreate(
    @GetCurrentUser() user: UserTokenInfo,
    @Body() userCreateDto: UserInviteDto
  ) {
    return this.userService.createOrInviteUser(user, userCreateDto);
  }

  @Public()
  @Post('create-user-by-invitation')
  userCreateByInvitation(
    @Body() userCreateByInvitationDto: UserCreateByInvitationDto
  ) {
    return this.userService.createUserByInvitationLink(
      userCreateByInvitationDto
    );
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordBody: { email: string }) {
    return this.userService.forgotPassword(forgotPasswordBody?.email);
  }

  @Public()
  @Post('reset-password-from-token')
  resetPasswordFromToken(
    @Body() resetPassword: { password: string; token: string }
  ) {
    return this.userService.resetPasswordFromToken(
      resetPassword.password,
      resetPassword.token
    );
  }
}
