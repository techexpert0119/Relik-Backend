import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PerformanceService } from './performance.service';
import { UserService } from "../../user/services/user.service";

describe('PerformanceService', () => {
  let service: PerformanceService;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    userService = {
      // Fill in the mock
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      exports: [PerformanceService],
      providers: [
        PerformanceService,
        {
          provide: UserService,
          useValue: userService,
        },
      ],
    }).compile();

    service = module.get<PerformanceService>(PerformanceService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
