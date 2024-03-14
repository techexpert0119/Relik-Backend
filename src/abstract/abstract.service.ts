import { deselect } from 'src/utils/api-features/deselect';
import { bodyFilter, queryFilter } from 'src/utils/api-features/filter';
import { paginate } from 'src/utils/api-features/paginate';
import { populate } from 'src/utils/api-features/populate';
import { select } from 'src/utils/api-features/select';
import { sort } from 'src/utils/api-features/sort';

export abstract class AbstractService {
  constructor(protected repository: any) {}

  async findAll(queryParam, excludedFields = [], deselectedFields = []) {
    try {
      const sortOptions = sort(queryParam.sortOptions);
      const selectOptions = select(queryParam.selectOptions);
      const { skip, limit } = paginate(queryParam.skip, queryParam.limit);
      const filteredQuery = queryFilter(queryParam, excludedFields);
      const allDeselectedFields = deselect(deselectedFields);
      let query = this.repository
        .find(filteredQuery, allDeselectedFields)
        .skip(skip)
        .limit(limit);
      query = query.sort(sortOptions);
      query = query.select(selectOptions);
      query = populate(queryParam?.popOptions, query);

      const data = await query;
      const dataLength = await this.repository.countDocuments(filteredQuery);

      return {
        data,
        status: 'success',
        length: dataLength,
      };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  }

  async create(data) {
    try {
      return await this.repository.create(data);
    } catch (err) {
      console.log(err);
    }
  }

  async findOne(id, queryParam, deselectedFields = []) {
    const allDeselectedFields = deselect(deselectedFields);
    const selectOptions = select(queryParam.selectOptions);
    let query = this.repository.findOne({ _id: id }, allDeselectedFields);
    query = query.select(selectOptions);
    query = populate(queryParam.popOptions, query);

    const data = await query;
    if (!data) return new Error('');

    return {
      status: 'success',
      data,
    };
  }

  async update(id, updateDto, excludedFields) {
    const filteredBody = bodyFilter(updateDto, excludedFields);
    const data = await this.repository.updateOne({ _id: id }, filteredBody);

    if (!data) return new Error('can not update');

    return {
      status: 'success',
      data,
    };
  }

  async remove(id) {
    const data = await this.repository.deleteOne({ _id: id });

    if (!data) return new Error('Can not delete!');

    return {
      status: 'success',
      data: null,
    };
  }
}
