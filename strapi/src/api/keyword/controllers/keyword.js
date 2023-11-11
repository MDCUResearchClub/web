"use strict";

/**
 *  keyword controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const _ = require("lodash/fp");
const strapiUtils = require("@strapi/utils");
const getLimitConfigDefaults = () => ({
  defaultLimit: _.toNumber(strapi.config.get("api.rest.defaultLimit", 25)),
  maxLimit: _.toNumber(strapi.config.get("api.rest.maxLimit")) || null
});
const shouldApplyMaxLimit = (limit, maxLimit, { isPagedPagination: isPagedPagination2 = false } = {}) => !isPagedPagination2 && limit === -1 || maxLimit !== null && limit > maxLimit;
const isOffsetPagination = (pagination) => _.has("start", pagination) || _.has("limit", pagination);
const isPagedPagination = (pagination) => _.has("page", pagination) || _.has("pageSize", pagination);
const getPaginationInfo = (params) => {
  const { defaultLimit, maxLimit } = getLimitConfigDefaults();
  const { pagination } = params;
  const isPaged = isPagedPagination(pagination);
  const isOffset = isOffsetPagination(pagination);
  if (isOffset && isPaged) {
    throw new strapiUtils.errors.ValidationError(
      "Invalid pagination parameters. Expected either start/limit or page/pageSize"
    );
  }
  if (!isOffset && !isPaged) {
    return {
      page: 1,
      pageSize: defaultLimit
    };
  }
  if (isPagedPagination(pagination)) {
    const pageSize = _.isUndefined(pagination.pageSize) ? defaultLimit : Math.max(1, _.toNumber(pagination.pageSize));
    return {
      page: Math.max(1, _.toNumber(pagination.page || 1)),
      pageSize: typeof maxLimit === "number" && shouldApplyMaxLimit(pageSize, maxLimit, { isPagedPagination: true }) ? maxLimit : Math.max(1, pageSize)
    };
  }
  const limit = _.isUndefined(pagination.limit) ? defaultLimit : _.toNumber(pagination.limit);
  return {
    start: Math.max(0, _.toNumber(pagination.start || 0)),
    limit: shouldApplyMaxLimit(limit, maxLimit) ? maxLimit || -1 : Math.max(1, limit)
  };
};

module.exports = createCoreController("api::keyword.keyword", ({ strapi }) => ({
  async top(ctx) {
    const { attributes, tableName } = strapi.db.metadata.get("api::keyword.keyword");
    const researchersAttribute = attributes["researchers"];
    const { joinTable } = researchersAttribute;
    const referencedColumn = joinTable.joinColumn.referencedColumn

    const fetchParams = strapi
      .service("api::keyword.keyword")
      .getFetchParams(ctx.query);
    const paginationInfo = getPaginationInfo(fetchParams);

    const results = await strapi.db.connection
      .select(`${tableName}.${referencedColumn}`, "title")
      .from(tableName)
      .leftJoin(
        `${joinTable.name}`,
        `${tableName}.${referencedColumn}`,
        `${joinTable.name}.${joinTable.joinColumn.name}`
      )
      .groupBy(
        `${tableName}.${referencedColumn}`).count(`${tableName}.${referencedColumn}`,
          { as: 'count' }
        )
      .orderBy('count', 'desc')

    const sanitizedResults = await this.sanitizeOutput(results, ctx);
    return this.transformResponse(sanitizedResults, {
      pagination: paginationInfo,
    });
  },
}));
