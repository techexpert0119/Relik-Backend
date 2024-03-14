import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';

export const FileDatabaseName = 'files';

@DatabaseEntity({ collection: FileDatabaseName })
export class File extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ required: true, type: String })
  orginalName: string;

  @Prop({ type: String })
  mimeType: string;

  @Prop({ type: Number })
  size: number;

  //TODO add new field imageHash 

  @Prop({ type: String })
  url: string;
}
export const FileSchema = SchemaFactory.createForClass(File);
export type FileDoc = File & Document;
