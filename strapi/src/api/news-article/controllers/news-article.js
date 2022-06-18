"use strict";

/**
 *  news-article controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::news-article.news-article",
  ({ strapi }) => ({
    // Method 2: Wrapping a core action (leaves core logic in place)
    async find(ctx) {
      // some custom logic here
      if (!ctx.state.user) {
        ctx.query = {
          ...ctx.query,
          filters: { ...ctx.query.filters, public: true },
        };
      }

      // Calling the default core action
      const { data, meta } = await super.find(ctx);

      return { data, meta };
    },

    async findOne(ctx) {
      // some custom logic here
      if (!ctx.state.user) {
        ctx.query = {
          ...ctx.query,
          filters: { ...ctx.query.filters, public: true },
        };
      }

      // Calling the default core action
      const { data, meta } = await super.findOne(ctx);

      return { data, meta };
    },
  })
);
