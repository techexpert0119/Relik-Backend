const alwaysDeselectedFields = ['__v'];

export const deselect = (deselectedFields) => {
  const mixedDeselectedFields = {};
  alwaysDeselectedFields.map((element) => (mixedDeselectedFields[element] = 0));
  deselectedFields.map((element) => (mixedDeselectedFields[element] = 0));
  return mixedDeselectedFields;
};
