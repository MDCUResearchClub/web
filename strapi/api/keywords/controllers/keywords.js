"use strict";

const {
  sanitizeEntity,
  convertRestQueryParams,
  buildQuery,
} = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async top(ctx) {
    const filters = convertRestQueryParams(ctx.query);

    // https://github.com/strapi/strapi/blob/86e0cf0f55d58e714a67cf4daee2e59e39974dd9/packages/strapi-database/lib/queries/relations-counts-queries.js#L6
    const target = "researchers";
    const model = strapi.query("keywords").model;
    const assoc = model.associations.find((assoc) => assoc.alias === target);
    const knex = strapi.connections[model.connection];
    const assocModelAttribute = strapi.query(assoc.collection).model.attributes[
      assoc.via
    ];

    const results = await model
      .query((qb) => {
        qb.join(
          assoc.tableCollectionName,
          `${model.modelName}.${model.primaryKey}`,
          `${assocModelAttribute.attribute}_${assocModelAttribute.column}`
        );
        qb.groupBy(`${model.modelName}.${model.primaryKey}`);
        qb.orderBy(knex.raw("COUNT(*)"), "desc");
      })
      .query(buildQuery({ model, filters }))
      .fetchAll();
    return results
      .toJSON()
      .map((entity) =>
        sanitizeEntity(entity, { model: strapi.models.keywords })
      );
  },
};
