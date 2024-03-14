export const paginate = (skip, limit) => {
  const querySkip = skip * 1 || 0;
  const queryLimit = limit * 1 || 10;

  return { skip: querySkip, limit: queryLimit };
};
