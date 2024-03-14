/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';

export class IPaginationMeta {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  last_page: number;
}
export class Paginate {
  @ApiProperty({ type: IPaginationMeta })
  meta: IPaginationMeta;
}
