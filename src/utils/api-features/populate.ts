export const populate = (options, Model) => {
  if (typeof options === 'string') {
    return Model.populate(options);
  }

  if (Array.isArray(options)) {
    options.map((option) => {
      const toObject = JSON.parse(option);

      let obj: any = {};
      if (toObject.path) obj.path = toObject.path;
      if (toObject.model) obj.model = toObject.model;
      if (toObject.select) obj.select = toObject.select;
      if (toObject.populate) obj.populate = toObject.populate;

      Model = Model.populate(obj);
    });

    return Model;
  }

  return Model.populate('');
};
