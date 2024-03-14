import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IDatabaseExistOptions } from 'src/common/database/interfaces/database.interface';
import { User, UserDoc } from 'src/modules/user/entities/user.entity';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { ENUM_USER_STATUS_CODE_ERROR } from '../constants/user.status-code.constant';
import { ENUM_ROLE_TYPE } from 'src/modules/role/constants/role.enum.constant';
import { AuthService } from 'src/common/auth/services/auth.service';
import { IUser, IUserDoc } from '../interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { compare, hash } from 'bcrypt';
import { RoleService } from 'src/modules/role/services/role.service';
import { ENUM_PERMISSION_ACTION } from 'src/modules/permissions/constants/permission.enum.constant';
import { UserSignUpDto } from '../dtos/user.sign-up.dto';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { PermissionService } from 'src/modules/permissions/services/permission.service';
import { ENUM_USER_SIGN_UP_FROM } from '../constants/user.enum.constant';
import { Role, RoleDoc } from '../../role/entities/role.entity';
import AuthenticationResultDto, {
  IUserForToken,
} from '../dtos/authentication-result.dto';
import { PageService } from '../../page/services/page.service';
import EditUserDto from '../dtos/edit-user.dto';
import { UserTokenInfo } from '../../../common/auth/types/user-token-info.type';
import { CompleteProfileDto } from '../dtos/complete-profile-dto';
import { UserCreateByInvitationDto } from '../dtos/user.create-by-invitation.dto';
import { AgencyService } from 'src/modules/agency/services/agency.service';
import { VerificationService } from 'src/modules/verification/services/verification.service';
import {
  ENUM_VERIFICATION_PURPOSE,
  ENUM_VERIFICATION_STATUS,
} from 'src/modules/verification/constants/varification.enum.constant';
import { VerificationDoc } from 'src/modules/verification/entities/varification.entity';
import { UserInviteDto } from '../dtos/user.invite.dto';
import { SessionService } from '../../session/services/session.service';
import { AgencyDto } from '../../agency/dtos/agency.dto';
import { ValidateEmailService } from 'src/common/validate-email/services/validate-email.service';
import { UserPasswordResetDto } from '../dtos/user.reset-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private readonly sessionService: SessionService,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
    private readonly authService: AuthService,
    private readonly helperDateService: HelperDateService,
    private readonly pageService: PageService,
    private readonly verificationService: VerificationService,
    private readonly validateEmailService: ValidateEmailService,
    @Inject(forwardRef(() => AgencyService))
    private readonly agencyService: AgencyService
  ) {}

  async existByEmail(
    email: string,
    options?: IDatabaseExistOptions
  ): Promise<boolean> {
    return this.userModel.findOne(
      {
        $or: [
          { email: { $regex: new RegExp(`^${email}$`, 'i') } },
          { cleanedEmail: { $regex: new RegExp(`^${email}$`, 'i') } },
        ],
      },
      { ...options, withDeleted: true }
    );
  }

  async cleanMailAddress(email) {
    const parts = email.split('@');
    let localPart = parts[0].replace(/\./g, '');

    // Remove any characters after a '+' (including the '+')
    const plusIndex = localPart.indexOf('+');
    if (plusIndex !== -1) {
      localPart = localPart.substring(0, plusIndex);
    }
    return localPart + '@' + parts[1];
    // const result=await this.validateEmailService.validateEmail(email)
    // if(result &&result?.type==="must-clean"){

    // }else{
    //   return email
    // }
  }

  async signUp({ firstName, email, password, signUpFrom }: UserSignUpDto) {
    const cleanedEmail = await this.cleanMailAddress(email);
    const isUserExist = await this.existByEmail(cleanedEmail);
    if (isUserExist) {
      throw new ConflictException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
        message: 'user.error.emailExist',
      });
    }

    const userAdminUserRole: RoleDoc = await this.roleService.findOneByType(
      ENUM_ROLE_TYPE.USER_ADMIN
    );
    const user = new this.userModel({
      firstName: firstName,
      email: email,
      password: await hash(password, 10),
      role: userAdminUserRole._id,
      isActive: false,
      inactivePermanent: false,
      signUpDate: this.helperDateService.create(),
      passwordAttempt: 0,
      signUpFrom: signUpFrom,
      cleanedEmail,
    });

    const savedUser = await user.save();
    if (!savedUser) {
      throw new ConflictException('User can not be saved');
    }

    const vericationEmail =
      await this.verificationService.createOrUpdateValidation(
        email,
        userAdminUserRole,
        ENUM_VERIFICATION_PURPOSE.VERIFICATION_EMAIL
      );

    if (!vericationEmail) {
      throw new ConflictException('Conflict happened in verication of email');
    }

    const session = await this.sessionService.saveSession(savedUser._id);
    const refreshToken = await this.authService.createRefreshToken(
      user.id,
      email,
      session.id
    );

    const accessToken = await this.authService.createAccessToken({
      payload: {
        userId: user.id,
        firstName: user.firstName,
        email: email,
        isActive: user.isActive,
        role: userAdminUserRole,
      },
      sessionId: session.id,
    });

    return {
      token: { refreshToken: refreshToken, accessToken: accessToken },
      createdUser: AuthenticationResultDto.fromDocs(user, userAdminUserRole),
    };
  }

  async signIn({
    email,
    password,
    rememberMe = true,
  }: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<AuthenticationResultDto> {
    if (password === null || password === 'null') {
      throw new ForbiddenException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
        message: 'user.error.notFound',
      });
    }

    const user = await this.userModel.findOne({ email: { $eq: email } }).exec();
    if (user?.signUpFrom != ENUM_USER_SIGN_UP_FROM.LOCAL) {
      throw new ForbiddenException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
        message: 'user.error.notFound',
      });
    }
    if (!user) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
        message: 'user.error.notFound',
      });
    }
    const passwordMatches = await compare(password, user.password);
    if (!passwordMatches) {
      throw new BadRequestException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NOT_MATCH_ERROR,
        message: 'user.error.passwordNotMatch',
      });
    }

    const userRole = await this.roleService.findOneById(user.role);

    if (!userRole)
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_ROLE_NOT_FOUND,
        message: 'role.error.notFound',
      });

    const session = await this.sessionService.saveSession(user._id);
    const refreshToken = rememberMe
      ? await this.authService.createRefreshToken(user.id, email, session.id)
      : undefined;
    const accessToken = await this.authService.createAccessToken({
      payload: {
        userId: user.id,
        firstName: user.firstName,
        email: email,
        isActive: user.isActive,
        role: userRole,
      },
      sessionId: session.id,
    });
    const agencies = await this.agencyService.getAllAgenciesByUserId(user?._id);

    return {
      user: AuthenticationResultDto.fromDocs(user, userRole),
      token: {
        refreshToken: refreshToken,
        accessToken: accessToken,
      },
      agencies,
    };
  }

  async resetPassword(
    user: UserTokenInfo,
    { oldPassword, newPassword }: UserPasswordResetDto
  ) {
    const currentUser = await this.userModel.findOne({
      _id: user.sub,
    });
    if (!currentUser) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
        message: 'user.error.notFound',
      });
    }

    const passwordMatches = await compare(oldPassword, currentUser.password);
    if (!passwordMatches) {
      throw new BadRequestException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NOT_MATCH_ERROR,
        message: 'user.error.passwordNotMatch',
      });
    }

    await this.userModel.findByIdAndUpdate(
      currentUser._id,
      {
        password: await hash(newPassword, 10),
      },
      { new: true }
    );
    return { success: true };
  }

  async completeProfile(
    user: UserTokenInfo,
    completeProfileDto: CompleteProfileDto,
    sessionId: string
  ): Promise<{ accessToken: string; user: IUserForToken }> {
    const currentUser = await this.userModel.findOne({ _id: user.sub });

    if (!currentUser) throw new NotFoundException('User has not been found');

    const roleToAssign = await this.roleService.findOneByType(
      completeProfileDto.role
    );

    if (!roleToAssign)
      throw new UnauthorizedException('Provided role has not been found');

    if (!sessionId)
      throw new UnauthorizedException('No session id has been provided');

    let agencyOfUser: { createdAgency: AgencyDto } | undefined;

    if (
      roleToAssign.type === ENUM_ROLE_TYPE.AGENCY_ADMIN ||
      roleToAssign.type === ENUM_ROLE_TYPE.USER_ADMIN ||
      roleToAssign.type === ENUM_ROLE_TYPE.SUPER_ADMIN
    ) {
      agencyOfUser = await this.agencyService.createAgency(
        {
          businessName: completeProfileDto.businessName,
          businessUrl: completeProfileDto.businessUrl,
          createdBy: currentUser._id,
          admins: [currentUser._id],
        },
        user
      );

      if (agencyOfUser.createdAgency) {
        await this.pageService.validateByNames(
          completeProfileDto.nameOfCelebrities
        );
        await this.pageService.createWithNames(
          currentUser._id,
          completeProfileDto.nameOfCelebrities,
          agencyOfUser.createdAgency._id
        );
      }
    }

    const defaultToUpdate = {
      role: roleToAssign._id,
      subscription: completeProfileDto.subscriptionId,
      photo: completeProfileDto.photo,
    };

    let updatedUser: UserDoc | undefined;

    switch (roleToAssign.type) {
      case ENUM_ROLE_TYPE.AGENCY_ADMIN:
        updatedUser = await this.userModel.findByIdAndUpdate(
          currentUser._id,
          {
            $set: {
              agencies: [agencyOfUser.createdAgency._id],
              ...defaultToUpdate,
            },
          },
          { new: true }
        );
        break;

      case ENUM_ROLE_TYPE.USER_ADMIN:
        updatedUser = await this.userModel.findByIdAndUpdate(
          currentUser._id,
          {
            $set: {
              ...defaultToUpdate,
            },
          },
          { new: true }
        );
        break;
    }

    if (!updatedUser)
      throw new InternalServerErrorException('Something went wrong');

    const newAccessToken = await this.authService.createAccessToken({
      payload: {
        userId: currentUser.id,
        firstName: currentUser.firstName,
        email: currentUser.email,
        isActive: currentUser.isActive,
        role: roleToAssign,
      },
      sessionId: sessionId,
    });

    return {
      accessToken: newAccessToken,
      user: AuthenticationResultDto.fromDocs(updatedUser, roleToAssign),
    };
  }

  async createOrInviteUser(
    user: UserTokenInfo,
    userCreateDto: UserInviteDto
  ): Promise<UserDoc | VerificationDoc> {
    const currentUser: IUserDoc = await this.userModel
      .findOne({ _id: user.sub })
      .populate('role');
    const { email } = userCreateDto;
    if (currentUser?.email === email) {
      throw new ConflictException('You can not invite yorself');
    }
    const role = await this.roleService.findOneByType(userCreateDto.userRole);
    if (!role) {
      throw new ConflictException('Role not found');
    }
    const isUserExist = await this.existByEmail(email);

    if (role.type === ENUM_ROLE_TYPE.AGENCY_ADMIN && isUserExist) {
      const invitedUser: IUserDoc = await this.userModel
        .findOne({ email: email })
        .populate('role');
      if (invitedUser?.agencies?.includes(userCreateDto.agencyId)) {
        throw new ConflictException(
          'This user has been already assigned to this agency'
        );
      }
      return await this.verificationService.createOrUpdateValidation(
        email,
        role,
        ENUM_VERIFICATION_PURPOSE.INVITATION_FOR_EXISTED_USER,
        currentUser,
        invitedUser,
        false,
        userCreateDto.agencyId
      );
    }
    if (isUserExist) {
      throw new ConflictException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
        message: 'user.error.emailExist',
      });
    }

    //check inviting user has permission to invite and create this kind of user

    const permissionsOfUser = [
      ...currentUser.permissions,
      ...currentUser.role.permissions,
    ];
    if (
      !permissionsOfUser.includes(
        `${ENUM_PERMISSION_ACTION.CREATE}_${role.type}`
      )
    ) {
      throw new UnauthorizedException('You do not have permission');
    }
    return await this.verificationService.createOrUpdateValidation(
      email,
      role,
      ENUM_VERIFICATION_PURPOSE.INVITATION,
      undefined,
      currentUser,
      false,
      userCreateDto.agencyId
    );
  }

  async updateUser(id: String, userUpdateDto: UserUpdateDto) {
    const updatingUser = await this.userModel.findById(id);
    if (!updatingUser) {
      return new NotFoundException('User not found with this id');
    }

    const permissions = userUpdateDto.permissions.length
      ? this.permissionService.parsePermissionToArray(userUpdateDto.permissions)
      : updatingUser.permissions;

    return this.userModel.findByIdAndUpdate(id, {
      ...userUpdateDto,
      permissions,
    });
  }

  async socialLogin(
    payload,
    authType: ENUM_USER_SIGN_UP_FROM
  ): Promise<AuthenticationResultDto> {
    let filterBySocialId: {
      googleId?: Types.ObjectId;
      facebookId?: Types.ObjectId;
      XId?: Types.ObjectId;
    } = {};

    switch (authType) {
      case ENUM_USER_SIGN_UP_FROM.GOOGLE:
        filterBySocialId = { googleId: payload?.id };
        break;
      case ENUM_USER_SIGN_UP_FROM.FACEBOOK:
        filterBySocialId = { facebookId: payload?.id };
        break;
      case ENUM_USER_SIGN_UP_FROM.X:
        filterBySocialId = { XId: payload?.id };
        break;
      default:
        throw new BadRequestException('Wrong auth type');
    }

    const user = await this.userModel.findOne(filterBySocialId);
    if (user) {
      if (!user.isActive) {
        throw new ForbiddenException({
          statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_INACTIVE_ERROR,
          message: 'user.error.inactive',
        });
      }

      const session = await this.sessionService.saveSession(user._id);
      const role = await this.roleService.findOneById(user.role);
      const refreshToken = await this.authService.createRefreshToken(
        user.id,
        user.email,
        session.id
      );
      const accessToken = await this.authService.createAccessToken({
        payload: {
          userId: user.id,
          firstName: user.firstName,
          email: user.email,
          isActive: user.isActive,
          role: role,
        },
        sessionId: session.id,
      });

      return {
        token: { refreshToken, accessToken },
        user: AuthenticationResultDto.fromDocs(user, role),
      };
    }

    if (payload.email) {
      const userWithSocialEmail = await this.userModel.findOne({
        email: payload.email,
      });
      if (userWithSocialEmail) {
        throw new ForbiddenException({
          statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_INACTIVE_ERROR,
          message: 'auth.error.emailAlreadyExists',
        });
      }
    }

    const role = await this.roleService.findOneByType(
      ENUM_ROLE_TYPE.USER_ADMIN
    );
    const newUser: UserDoc = await this.userModel.create({
      firstName: payload?.firstName,
      email: payload?.email,
      role: role._id,
      signUpFrom: authType,
      isActive: true,
      password: null,
      inactivePermanent: false,
      signUpDate: this.helperDateService.create(),
      passwordAttempt: 0,
      googleId:
        authType === ENUM_USER_SIGN_UP_FROM.GOOGLE ? payload.id : undefined,
      facebookId:
        authType === ENUM_USER_SIGN_UP_FROM.FACEBOOK ? payload.id : undefined,
      XId: authType === ENUM_USER_SIGN_UP_FROM.X ? payload.id : undefined,
      permissions: role.permissions,
    });

    const session = await this.sessionService.saveSession(newUser._id);
    const refreshToken = await this.authService.createRefreshToken(
      newUser.id,
      newUser.email,
      session.id
    );
    const accessToken = await this.authService.createAccessToken({
      payload: {
        userId: newUser.id,
        firstName: newUser.firstName,
        email: newUser.email,
        isActive: newUser.isActive,
        role: role,
      },
      sessionId: session.id,
    });

    return {
      token: { refreshToken, accessToken },
      user: AuthenticationResultDto.fromDocs(newUser, role),
    };
  }

  async getCreatedUserByRole(
    roleName: ENUM_ROLE_TYPE,
    user: UserTokenInfo,
    userId: string,
    pageNumber: string = '0',
    pageSize: string = '10',
    searchText: string
  ) {
    const mainUser: IUserDoc = await this.userModel
      .findOne({ _id: userId ? userId : user.sub })
      .populate('role');
    const getAllUsersForSuperAdmin =
      mainUser.role.type === ENUM_ROLE_TYPE.SUPER_ADMIN && !roleName;
    const totalCountResult = await this.userModel.aggregate([
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'role',
        },
      },
      {
        $match: {
          createdBy: mainUser._id,
        },
      },
      {
        $match: {
          'role.type': {
            $in: getAllUsersForSuperAdmin
              ? [
                  ENUM_ROLE_TYPE.AGENCY_ADMIN,
                  ENUM_ROLE_TYPE.SUPER_ADMIN,
                  ENUM_ROLE_TYPE.USER_ADMIN,
                  ENUM_ROLE_TYPE.TALENT_MANAGER,
                ]
              : [roleName],
          },
        },
      },
      {
        $count: 'total',
      },
    ]);
    const totalCount =
      totalCountResult.length > 0 ? totalCountResult[0].total : 0;
    const users = await this.userModel.aggregate([
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'role',
        },
      },
      {
        $match: {
          createdBy: mainUser._id,
        },
      },
      {
        $match: {
          'role.type': {
            $in: getAllUsersForSuperAdmin
              ? [
                  ENUM_ROLE_TYPE.AGENCY_ADMIN,
                  ENUM_ROLE_TYPE.SUPER_ADMIN,
                  ENUM_ROLE_TYPE.TALENT_MANAGER,
                  ENUM_ROLE_TYPE.USER_ADMIN,
                ]
              : [roleName],
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
        },
      },
      {
        $addFields: {
          role: { $arrayElemAt: ['$role', 0] },
          createdBy: { $arrayElemAt: ['$createdBy', 0] },
        },
      },
      {
        $match: {
          $or: [
            searchText
              ? { firstName: { $regex: searchText, $options: 'i' } }
              : {},
            searchText ? { email: { $regex: searchText, $options: 'i' } } : {},
          ],
        },
      },
      { $unset: 'password' },
      { $skip: +pageNumber * +pageSize },
      { $limit: +pageSize },
    ]);
    return { data: users, totalCount };
  }

  async logout(userId: string) {
    if (!userId) {
      return new NotFoundException('user not found');
    }
    return await this.userModel.updateMany(
      { _id: userId, hashedRt: { $ne: null } },
      { hashedRt: null }
    );
  }

  async refresh(userId: string, sessionId: string) {
    const user = await this.userModel.findById({ _id: userId });
    if (!user) {
      return new ForbiddenException('user not found');
    }

    const session = await this.sessionService.findById(sessionId);
    if (!session)
      throw new UnauthorizedException('session not found, expired or closed');

    const refreshToken = await this.authService.createRefreshToken(
      user.id,
      user.email,
      session.id
    );
    const userRole = await this.roleService.findOneById(user.role);
    const accessToken = await this.authService.createAccessToken({
      payload: {
        userId: user.id,
        firstName: user.firstName,
        email: user.email,
        isActive: user.isActive,
        role: userRole,
      },
      sessionId: session.id,
    });

    return {
      user: AuthenticationResultDto.fromDocs(user, userRole),
      token: { refreshToken: refreshToken, accessToken: accessToken },
    };
  }

  userWithPermissions(user) {
    return {
      ...user._doc,
      permissions: [...user.permissions, ...user.role.permissions],
    };
  }

  async getUserDataById(id: string): Promise<IUser> {
    const user: IUser = await this.userModel
      .findById(id)
      .populate('role photo')
      .select('-password');

    if (!user) {
      throw new NotFoundException('User has not been found');
    }

    return this.userWithPermissions(user);
  }

  async editUser(
    userToken: UserTokenInfo,
    user: EditUserDto
  ): Promise<UserDoc> {
    const dataForUpdate = {} as Partial<UserDoc>;

    const userFromDb = await this.userModel.findById(
      new Types.ObjectId(userToken.sub)
    );
    const userRole = await this.roleModel.findById(userFromDb.role);

    switch (userRole.type) {
      case ENUM_ROLE_TYPE.AGENCY_ADMIN:
        // TO DO we need ask Walid in edit page how agency admin will update agency info becouse it may have multiple agencies
        // dataForUpdate.businessName = user.businessName;
        // dataForUpdate.businessUrl = user.businessUrl;
        dataForUpdate.firstName = user.firstName;
        dataForUpdate.photo = user.photo;
        break;
      case ENUM_ROLE_TYPE.USER_ADMIN:
        dataForUpdate.firstName = user.firstName;
        dataForUpdate.photo = user.photo;
        break;
      default:
        dataForUpdate.firstName = user.firstName;
        dataForUpdate.photo = user.photo;
    }

    // remove undefined or null
    Object.keys(dataForUpdate).forEach((key) => {
      if (dataForUpdate[key] === null) {
        delete dataForUpdate[key];
      }
    });

    return this.userModel.findByIdAndUpdate(
      userFromDb._id,
      { $set: { ...dataForUpdate } },
      { new: true }
    );
  }

  async getTwitterUserAuth(req, res) {
    const code = req.query.code;
    const TwitterOAuthToken = await this.authService.getTwitterOAuthToken(code);
    if (!TwitterOAuthToken) {
      return new ForbiddenException({
        message: 'Can not authorise by Twitter',
      });
    }
    if (TwitterOAuthToken) {
      const twitterUser = await this.authService.getTwitterUser(
        TwitterOAuthToken?.access_token
      );

      const registeredUserInfo = await this.socialLogin(
        {
          id: twitterUser.id,
          firstName: twitterUser.name,
          email: twitterUser.email,
        },
        ENUM_USER_SIGN_UP_FROM.X
      );
      return res.redirect(
        `http://localhost:3000/auth/sign-in?userInfo=${JSON.stringify(
          registeredUserInfo
        )}`
      );
    } else {
      return new ForbiddenException({
        message: 'Can not authorise by Twitter',
      });
    }
  }

  async createUserByInvitationLink(payload: UserCreateByInvitationDto) {
    const verification = await this.verificationService.findVerificationByToken(
      payload.token
    );
    if (
      verification &&
      verification.status === ENUM_VERIFICATION_STATUS.PENDING
    ) {
      const roleOfSigningUpUser = await this.roleModel.findById(
        verification.role
      );
      const user = new this.userModel({
        email: verification?.email,
        password: await hash(payload.password, 10),
        role: verification.role,
        isActive: true,
        inactivePermanent: false,
        signUpDate: this.helperDateService.create(),
        passwordAttempt: 0,
        signUpFrom: ENUM_USER_SIGN_UP_FROM.LOCAL,
        createdBy: verification.createdBy,
        firstName: payload?.firstName,
      });

      await user.save();
      if (roleOfSigningUpUser.type === ENUM_ROLE_TYPE.AGENCY_ADMIN) {
        user.agencies = [...user.agencies, verification?.agency];
        await user.save();
        await this.agencyService.addAdminToAgency(
          verification.agency,
          user._id
        );
      }
      const session = await this.sessionService.saveSession(user._id);
      const refreshToken = await this.authService.createRefreshToken(
        user.id,
        verification.email,
        session.id
      );
      const accessToken = await this.authService.createAccessToken({
        payload: {
          userId: user.id,
          firstName: user.firstName,
          email: verification.email,
          isActive: user.isActive,
          role: roleOfSigningUpUser,
        },
        sessionId: session.id,
      });
      await this.verificationService.delete(verification?._id);
      return {
        token: { refreshToken: refreshToken, accessToken: accessToken },
        createdUser: AuthenticationResultDto.fromDocs(
          user,
          roleOfSigningUpUser
        ),
      };
    } else {
      throw new ConflictException('Invitation is not valid');
    }
  }

  async verifyEmailForRegistration(token: string) {
    const validation = await this.verificationService.validateValidation(token);
    if (validation.success) {
      const user = await this.userModel.findOneAndUpdate(
        { email: validation.verification.email },
        { isActive: true },
        { new: true }
      );

      switch (validation.verification.purpose) {
        case ENUM_VERIFICATION_PURPOSE.VERIFICATION_EMAIL: {
          await this.verificationService.updateVerificationById(
            validation.verification._id,
            { status: ENUM_VERIFICATION_STATUS.ACCEPTED }
          );

          break;
        }

        case ENUM_VERIFICATION_PURPOSE.FORGOT_PASSWORD: {
          await this.verificationService.delete(validation.verification._id);
          break;
        }
      }

      const userRole = await this.roleModel.findById(user?.role);
      const session = await this.sessionService.saveSession(user._id);
      const refreshToken = await this.authService.createRefreshToken(
        user.id,
        user?.email,
        session.id
      );

      const accessToken = await this.authService.createAccessToken({
        payload: {
          userId: user.id,
          firstName: user.firstName,
          email: user?.email,
          isActive: user.isActive,
          role: userRole,
        },
        sessionId: session.id,
      });

      const agencies = await this.agencyService.getAllAgenciesByUserId(
        user?._id
      );

      return {
        token: { refreshToken: refreshToken, accessToken: accessToken },
        user: AuthenticationResultDto.fromDocs(user, userRole),
        agencies,
      };
    }
  }

  async resendVerificationToken(user: UserTokenInfo) {
    const currentUser = await (
      await this.userModel.findById(user.sub)
    ).populate('role');

    if (!currentUser) return new NotFoundException('User not found!');

    if (currentUser.isActive) {
      return new NotFoundException('This Email has been already verified!');
    }

    return await this.verificationService.resendWithoutToken(
      currentUser as unknown as IUserDoc,
      ENUM_VERIFICATION_PURPOSE.VERIFICATION_EMAIL
    );
  }

  async changeAccount(user: UserTokenInfo, accountId: string) {
    let currentUser = undefined;

    if (accountId === user.sub) {
      currentUser = await this.userModel
        .findByIdAndUpdate(
          user.sub,
          { $unset: { currentAgency: '' } },
          { new: true }
        )
        .exec();
    } else {
      currentUser = await this.userModel
        .findByIdAndUpdate(
          user.sub,
          { currentAgency: accountId },
          { new: true }
        )
        .exec();
    }

    return currentUser;
  }

  async removeAgencyFromAdmin(agencyId, adminId) {
    const admin = await this.userModel.findById(adminId);

    if (!admin || !admin.agencies) {
      throw new Error('Admin not found or no agencies assigned');
    }

    const updatedAgencies = admin.agencies.filter(
      (agency) => agency.toString() !== agencyId.toString()
    );

    admin.agencies = updatedAgencies;
    await admin.save();

    return admin;
  }

  async forgotPassword(email: string) {
    const isUserExist = await this.existByEmail(email);

    if (!isUserExist) {
      throw new ConflictException('User not found with this email!');
    }

    const purpose = ENUM_VERIFICATION_PURPOSE.FORGOT_PASSWORD;

    await this.verificationService.checkBeforeSendingAnEmail(email, purpose);
    await this.verificationService.cleanUpVerificationModel(email, purpose);

    const verificationEmail =
      await this.verificationService.createNewValidation(email, purpose);

    if (!verificationEmail) {
      throw new ConflictException('Can not send verification email!');
    }

    return { success: true };
  }

  async resetPasswordFromToken(password: string, token: string) {
    const isTokenValid =
      await this.verificationService.validateValidation(token);
    if (!isTokenValid.success) {
      throw new Error('Validation token is expired');
    }
    const findUserByEmail = await this.userModel.findOne({
      email: isTokenValid?.verification?.email,
    });
    if (!findUserByEmail) {
      throw new Error('User not found');
    }

    await this.userModel.findByIdAndUpdate(
      findUserByEmail._id,
      {
        password: await hash(password, 10),
      },
      { new: true }
    );
    await this.verificationService.delete(isTokenValid.verification?._id);
    return { success: true };
  }

  async addUserToAgency(token) {
    const invitation = await this.verificationService.validateValidation(token);
    if (!invitation) {
      throw new ConflictException('Invitation not found');
    }
    const user = await this.userModel.findById(
      invitation?.verification?.invitedUser
    );
    if (!user) {
      throw new ConflictException('User not found');
    }
    const agency = await this.agencyService.addAdminToAgency(
      new Types.ObjectId(invitation?.verification?.agency),
      new Types.ObjectId(invitation?.verification?.invitedUser)
    );
    if (agency) {
      user.agencies = [...user.agencies, agency?._id];
      await user.save();
      await this.verificationService.delete(invitation?.verification?._id);
      return { success: true };
    }
  }
}
