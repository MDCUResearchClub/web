module.exports = {
  routes: [
    {
      method: "GET",
      path: "/keywords/top",
      handler: "keyword.top",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
