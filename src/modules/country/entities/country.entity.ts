import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';

export const CountryDatabaseName = 'country';

@DatabaseEntity({ collection: CountryDatabaseName })
export class Country extends DatabaseMongoUUIDEntityAbstract {
  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    type: String,
  })
  dial_code: string;

  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  code: string;
}
export const CountrySchema = SchemaFactory.createForClass(Country);
export type CountryDoc = Country & Document;
