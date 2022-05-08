"use strict";

/**
 *  keyword controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const {
  getPaginationInfo,
  convertPagedToStartLimit,
  transformPaginationResponse,
} = require("@strapi/strapi/lib/core-api/service/pagination");
const {
  transformParamsToQuery,
} = require("@strapi/strapi/lib/services/entity-service/params");

module.exports = createCoreController("api::keyword.keyword", ({ strapi }) => ({
  async top(ctx) {
    const qb = strapi.db.queryBuilder("api::keyword.keyword");
    const { attributes } = strapi.db.metadata.get("api::keyword.keyword");
    const researchersAttribute = attributes["researchers"];
    const { joinTable } = researchersAttribute;
    const joinAlias = qb.getAlias();

    const fetchParams = strapi
      .service("api::keyword.keyword")
      .getFetchParams(ctx.query);
    const paginationInfo = getPaginationInfo(fetchParams);

    // https://github.com/strapi/strapi/blob/3f204a0a48d4e1f6dca21683eb6c63041b2f6626/packages/core/database/lib/query/query-builder.js
    // https://github.com/strapi/strapi/blob/3f204a0a48d4e1f6dca21683eb6c63041b2f6626/packages/core/strapi/lib/core-api/service/collection-type.js#L29
    const subQB = qb
      .init({
        ...fetchParams,
        ...transformParamsToQuery(
          "api::keyword.keyword",
          convertPagedToStartLimit(paginationInfo)
        ),
      })
      .join({
        alias: joinAlias,
        referencedTable: joinTable.name,
        referencedColumn: joinTable.inverseJoinColumn.name,
        rootColumn: joinTable.inverseJoinColumn.referencedColumn,
        rootTable: qb.alias,
        on: joinTable.on,
      })
      .select(["id", "title", qb.raw("count(*) AS count")])
      .groupBy(`${joinAlias}.${joinTable.joinColumn.name}`)
      .getKnexQuery();

    const results = await strapi.db
      .getConnection()
      .select("*")
      .orderBy("count", "desc")
      .from(subQB.as("subQuery"));

    const sanitizedResults = await this.sanitizeOutput(results, ctx);
    return this.transformResponse(sanitizedResults, {
      pagination: paginationInfo,
    });
  },
}));
