module.exports = (query) => {
  const views = [
    {
      name: "desc",
      position: "desc",
    },
    {
      name: "asc",
      position: "asc",
    },
    {
      name: "nameaz",
      title: "asc",
    },
  ];

  let indexView = 0;
  if (query.sort) {
    indexView = views.findIndex((item) => item.name === query.sort);
  }

  delete views[indexView].name;

  return views[indexView];
};
