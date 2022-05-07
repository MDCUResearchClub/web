module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/nextjs/login',
      handler: 'nextjs.login',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
