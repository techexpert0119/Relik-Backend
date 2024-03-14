import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDoc } from 'src/modules/role/entities/role.entity';
import { Model, Types } from 'mongoose';
import { User } from 'src/modules/user/entities/user.entity';
import { IUserDoc } from 'src/modules/user/interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/common/mail/services/mail.service';
import { UserTokenInfo } from 'src/common/auth/types/user-token-info.type';
import { Verification, VerificationDoc } from '../entities/varification.entity';
import {
  ENUM_VERIFICATION_PURPOSE,
  ENUM_VERIFICATION_STATUS,
} from '../constants/varification.enum.constant';
import { IPopolatedVerification } from '../interfaces/verification.interface';
@Injectable()
export class VerificationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Verification.name)
    private verificationModel: Model<Verification>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private readonly configService: ConfigService,
    private readonly mailService: MailService
  ) {}

  createInvitationEmailHtml(
    invitingUser: string,
    role: string,
    expireDate: Date,
    inviteLink: string
  ): string {
    const formattedExpireDate = expireDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `
      <!DOCTYPE html>
      <html lang="en">
      
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
      
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
      
          h1 {
            color: #333333;
          }
      
          p {
            color: #555555;
          }
      
          .invitation-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
          }
      
          .footer {
            margin-top: 20px;
            text-align: center;
            color: #999999;
          }
        </style>
      </head>
      
      <body>
        <div class="container">
          <h1>Admin Invitation</h1>
          <p>
            ${invitingUser} has invited you to be an ${role}. Your contribution is highly valued.
          </p>
          <p>
            Role: ${role}<br>
            Expiration Date: ${formattedExpireDate}
          </p>
          <p>
            Please click the button below to accept the invitation:
          </p>
          <a href="${inviteLink}" class="invitation-button">Accept Invitation</a>
          <div class="footer">
            If you have any questions, please contact us at [Contact Email].
          </div>
        </div>
      </body>
      
      </html>
    `;
  }
  createVerificationEmailHtml(verificationUrl) {
    return `
    <html>
        <head>
          <title>Email Verification</title>
        </head>
        <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #4a90e2; text-align: center;">Email Verification</h2>
                <p>Hello,</p>
                <p>Thank you for registering with us. Please click the link below to verify your email address and complete your registration. The link will expire in 2 days.</p>
                <div style="text-align: center; margin: 20px;">
                    <a href="${verificationUrl}" style="background-color: #4a90e2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
                </div>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Best regards,<br>Your Relik Team</p>
            </div>
        </body>
    </html>
    `;
  }
  createForgotPasswordHTML(verificationUrl) {
    return `
        <html>
            <head>
              <title>Email Verification</title>
            </head>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #4a90e2; text-align: center;">Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>You have requested to reset your password. Please click on the button below to set a new password. The link will expire in 10 minutes.</p>
                    <div style="text-align: center; margin: 20px;">
                        <a href="${verificationUrl}" style="background-color: #4a90e2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                    </div>
                    <p>If you did not request a password reset, please ignore this email.</p>
                    <p>Best regards,<br>Your Relik Team</p>
                </div>
            </body>
        </html>
    `;
  }
  async createNewValidation(
    email: string,
    purpose: ENUM_VERIFICATION_PURPOSE,
    role?: RoleDoc,
    createdBy?: IUserDoc,
    agencyId?: Types.ObjectId,
    invitedUser?: IUserDoc
  ): Promise<VerificationDoc> {
    const currentDate = new Date();
    const expirationDate = new Date();

    if (purpose === ENUM_VERIFICATION_PURPOSE.FORGOT_PASSWORD) {
      expirationDate.setMinutes(currentDate.getMinutes() + 10);
    } else {
      expirationDate.setDate(currentDate.getDate() + 2);
    }

    const token = uuidv4();
    let url = undefined;
    if (purpose === ENUM_VERIFICATION_PURPOSE.INVITATION) {
      url = 'auth/invitation';
    } else if (purpose === ENUM_VERIFICATION_PURPOSE.VERIFICATION_EMAIL) {
      url = 'verify-email';
    } else if (purpose === ENUM_VERIFICATION_PURPOSE.FORGOT_PASSWORD) {
      url = 'auth/reset-password';
    } else if (
      purpose === ENUM_VERIFICATION_PURPOSE.INVITATION_FOR_EXISTED_USER
    ) {
      url = 'auth/invitation';
    }
    const verificationLink = `${this.configService.get<string>(
      'app.client_host'
    )}/${url}?token=${token}`;
    let rowHTML = '';
    if (purpose === ENUM_VERIFICATION_PURPOSE.VERIFICATION_EMAIL) {
      rowHTML = this.createVerificationEmailHtml(verificationLink);
    } else if (
      purpose === ENUM_VERIFICATION_PURPOSE.INVITATION ||
      purpose === ENUM_VERIFICATION_PURPOSE.INVITATION_FOR_EXISTED_USER
    ) {
      rowHTML = this.createInvitationEmailHtml(
        createdBy?.firstName,
        role?.name,
        expirationDate,
        verificationLink
      );
    } else if (purpose === ENUM_VERIFICATION_PURPOSE.FORGOT_PASSWORD) {
      rowHTML = this.createForgotPasswordHTML(verificationLink);
    }
    const verificationMail = await this.mailService.sendMail(
      email,
      'Verification',
      rowHTML
    );
    if (!verificationMail) {
      throw new ConflictException(
        'Problem happened to send email to this mail!'
      );
    }
    const newVerification = await this.verificationModel.create({
      email,
      role: role?._id,
      status: ENUM_VERIFICATION_STATUS.PENDING,
      createdBy: createdBy?._id,
      expireDate: expirationDate,
      verificationToken: token,
      verificationLink,
      purpose,
      agency: agencyId,
      invitedUser: invitedUser?._id,
    });
    if (!newVerification) {
      throw new ConflictException('Can not save verification');
    }
    return newVerification;
  }
  async createOrUpdateValidation(
    email: string,
    role: RoleDoc,
    purpose: ENUM_VERIFICATION_PURPOSE,
    createdBy?: IUserDoc,
    invitedUser?: IUserDoc,
    resent?: boolean,
    agencyId?: Types.ObjectId
  ): Promise<VerificationDoc> {
    const invitation: VerificationDoc | undefined =
      await this.verificationModel.findOne({ email, purpose });
    if (invitation) {
      const currentDate = new Date();
      const expirationDate = invitation.expireDate;
      if (
        expirationDate > currentDate &&
        invitation.status === ENUM_VERIFICATION_STATUS.PENDING
      ) {
        throw new ConflictException('user.error.invitationSend');
      } else {
        if (resent) {
          await this.verificationModel.findByIdAndDelete(invitation._id);
          return await this.createNewValidation(
            email,
            purpose,
            role,
            createdBy,
            agencyId,
            invitedUser
          );
        }
      }
    } else {
      return await this.createNewValidation(
        email,
        purpose,
        role,
        createdBy,
        agencyId,
        invitedUser
      );
    }
  }
  async validateValidation(token: string) {
    const verification = await this.verificationModel.findOne({
      verificationToken: token,
    });
    if (!verification) {
      throw new ConflictException('Invitation not found');
    }

    const currentDate = new Date();
    const expirationDate = verification.expireDate;
    if (currentDate > expirationDate) {
      throw new ConflictException('Verification is expered');
    }
    if (verification.status === ENUM_VERIFICATION_STATUS.ACCEPTED) {
      throw new ConflictException('This token has beed already accepted');
    }
    if (verification.status === ENUM_VERIFICATION_STATUS.REJECTED) {
      throw new ConflictException('This token has beed already rejected');
    }

    if (token === verification.verificationToken) {
      return { success: true, verification };
    } else {
      throw new ForbiddenException('Wrong crediantials');
    }
  }
  async findVerificationByToken(token: string): Promise<VerificationDoc> {
    return await this.verificationModel.findOne({ verificationToken: token });
  }
  async getAllValidationsOfUser(
    user: UserTokenInfo,
    pageNumber: string,
    pageSize: string,
    searchText: string
  ) {
    const mainUserId = user.sub;
    const skip = parseInt(pageNumber) * parseInt(pageSize);

    const searchConditions = searchText
      ? {
          $or: [
            { firstName: { $regex: searchText, $options: 'i' } },
            { email: { $regex: searchText, $options: 'i' } },
          ],
        }
      : {};

    const totalCount = await this.verificationModel.countDocuments({
      createdBy: mainUserId,
      ...searchConditions,
    });

    const users = await this.verificationModel
      .find({ createdBy: mainUserId, ...searchConditions })
      .populate({
        path: 'createdBy invitedUser',
        select: '-password -hashedRt', // Excludes specific fields
      })
      .populate('role')
      .skip(skip)
      .limit(parseInt(pageSize))
      .exec();

    return { data: users, totalCount };
  }

  async resend(id) {
    const invitation: IPopolatedVerification = await this.verificationModel
      .findById(id)
      .populate('createdBy role invitedUser');
    if (!invitation) {
      throw new NotFoundException('Not found');
    }

    if (invitation) {
      const currentDate = new Date();
      const expirationDate = invitation.expireDate;
      if (
        expirationDate > currentDate &&
        invitation.status === ENUM_VERIFICATION_STATUS.PENDING
      ) {
        throw new ConflictException('user.error.invitationSend');
      }
    }
    const newInvitation = await this.createNewValidation(
      invitation.email,
      invitation?.purpose,
      invitation.role,
      invitation.createdBy,
      invitation?.agency,
      invitation?.invitedUser
    );
    await this.delete(invitation?._id);
    return newInvitation;
  }

  async delete(id) {
    return await this.verificationModel.findByIdAndDelete(id);
  }

  async checkBeforeSendingAnEmail(
    email: string,
    purpose: ENUM_VERIFICATION_PURPOSE
  ) {
    switch (purpose) {
      case ENUM_VERIFICATION_PURPOSE.VERIFICATION_EMAIL: {
        const verification = await this.verificationModel.findOne({
          purpose,
          email,
        });

        if (verification && new Date() < new Date(verification.expireDate)) {
          throw new BadRequestException(
            'You need to wait before you can make a new request!'
          );
        }

        break;
      }
    }
  }

  async cleanUpVerificationModel(
    email: string,
    purpose: ENUM_VERIFICATION_PURPOSE
  ) {
    await this.verificationModel.deleteMany({ email, purpose });
  }

  async resendWithoutToken(user: IUserDoc, purpose: ENUM_VERIFICATION_PURPOSE) {
    await this.checkBeforeSendingAnEmail(user.email, purpose);
    await this.cleanUpVerificationModel(user.email, purpose);

    return await this.createNewValidation(
      user?.email,
      purpose,
      user.role,
      undefined,
      undefined,
      user
    );
  }

  async updateVerificationById(id: Types.ObjectId, data) {
    return await this.verificationModel.findByIdAndUpdate(id, data);
  }
}
