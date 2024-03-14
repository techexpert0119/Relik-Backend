const bodyExludedFields = ['_id'];
const queryExludedFields = [
  'skip',
  'limit',
  'popOptions',
  'sortOptions',
  'selectOptions',
];

const filter = (params, alwaysExludedFields = [], exludedFields = []) => {
  const filteredObj = { ...params };
  const mixedExcludedFields = [...alwaysExludedFields, ...exludedFields];
  mixedExcludedFields?.forEach((el) => delete filteredObj[el]);

  return filteredObj;
};

export const bodyFilter = (body, exludedFields) => {
  return filter(body, bodyExludedFields, exludedFields);
};

export const queryFilter = (query, exludedFields) => {
  return filter(query, queryExludedFields, exludedFields);
};
