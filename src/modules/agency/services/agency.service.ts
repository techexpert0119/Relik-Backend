import {
  ConflictException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Agency } from '../entities/agency.entity';
import { AgencyCreateDto } from '../dtos/agency.create.dto';
import { UserTokenInfo } from 'src/common/auth/types/user-token-info.type';
import { ENUM_ROLE_TYPE } from 'src/modules/role/constants/role.enum.constant';
import { PageService } from 'src/modules/page/services/page.service';
import { UserService } from 'src/modules/user/services/user.service';
import { AgencyUpdateDto } from '../dtos/agency.update.dto';

@Injectable()
export class AgencyService {
  constructor(
    @InjectModel(Agency.name) private agencyModel: Model<Agency>,
    private readonly pageService: PageService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  async createAgency(payload: AgencyCreateDto, user: UserTokenInfo) {
    const createdAgency = await this.agencyModel.create({
      businessName: payload?.businessName,
      createdBy: user?.sub,
      photo: payload?.photo,
      businessUrl: payload?.businessUrl,
      admins: [new Types.ObjectId(user?.sub)],
    });
    if (payload.nameOfCelebrities.length) {
      await this.pageService.createWithNames(
        new Types.ObjectId(user?.sub),
        payload?.nameOfCelebrities,
        createdAgency._id
      );
    }
    const allGenciesOfUser = await this.getAllAgenciesByUserId(
      new Types.ObjectId(user?.sub)
    );
    return { createdAgency, allGenciesOfUser };
  }

  async getAllAgencies(
    user: UserTokenInfo,
    searchText: string,
    pageSize: string,
    pageNumber: string
  ) {
    const matchConditions: any =
      user.role.type === ENUM_ROLE_TYPE.SUPER_ADMIN
        ? {}
        : {
            createdBy: new Types.ObjectId(user.sub),
          };
    if (searchText) {
      matchConditions.businessName = { $regex: searchText, $options: 'i' };
    }
    try {
      const totalCount = await this.agencyModel.count(matchConditions);

      const agencies = await this.agencyModel
        .find(matchConditions)
        .populate('createdBy')
        .populate('admins')
        .skip(+pageNumber * +pageSize)
        .limit(+pageSize)
        .sort({ createdAt: -1 });
      return { data: agencies, totalCount };
    } catch (err) {}
  }
  async getAllAgenciesByUserId(userId: Types.ObjectId) {
    const agencies = await this.agencyModel.find({
      $or: [{ createdBy: userId }, { admins: userId }],
    });
    return agencies;
  }

  async getOneById(id: string) {
    const agency = await this.agencyModel
      .findById(id)
      .populate({
        path: 'admins',
        populate: { path: 'createdBy' },
      })
      .populate('createdBy');
    if (!agency) {
      return new ConflictException('Agency not found');
    }
    return agency;
  }
  async addAdminToAgency(agencyId: Types.ObjectId, adminId: Types.ObjectId) {
    const agency = await this.agencyModel.findById(agencyId);

    if (!agency) {
      throw new ConflictException('Agency not found');
    }
    if (!agency?.admins?.includes(adminId)) {
      agency.admins.push(adminId);
      await agency.save();
    } else {
      throw new ConflictException(
        'This admin is already assigned to this agency!'
      );
    }
    return agency;
  }
  async removeAdmin(agencyId, adminId) {
    const agency = await this.agencyModel.findById(agencyId);
    const admins = agency.admins?.filter((i) => i != adminId);
    if (admins.length === 0) {
      throw new ConflictException(
        ' Removing single admin is not allowed, Please assign new admin before removing!'
      );
    }
    agency.admins = admins;
    await agency.save();
    await this.userService.removeAgencyFromAdmin(agencyId, adminId);
    return agency;
  }
  async updateAgency(id: string, payload: AgencyUpdateDto) {
    const agency = await this.agencyModel.findByIdAndUpdate(
      id,
      {
        businessName: payload?.businessName,
        photo: payload?.photo,
        businessUrl: payload?.businessUrl,
      },
      { new: true }
    );
    return agency;
  }
}
