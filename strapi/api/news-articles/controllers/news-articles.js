"use strict";

const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Retrieve records.
   *
   * @return {Array}
   */
  async find(ctx) {
    let entities;
    if (!ctx.state.user) {
      // Public user cannot get internal news.
      ctx.query["public"] = true;
    }

    if (ctx.query._q) {
      entities = await strapi.services["news-articles"].search(ctx.query);
    } else {
      entities = await strapi.services["news-articles"].find(ctx.query);
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models["news-articles"] })
    );
  },

  /**
   * Retrieve a record.
   *
   * @return {Object}
   */
  async findOne(ctx) {
    const { id } = ctx.params;

    const params = { id };

    if (!ctx.state.user) {
      // Public user cannot get internal news.
      params["public"] = true;
    }

    const entity = await strapi.services["news-articles"].findOne(params);
    return sanitizeEntity(entity, { model: strapi.models["news-articles"] });
  },
};