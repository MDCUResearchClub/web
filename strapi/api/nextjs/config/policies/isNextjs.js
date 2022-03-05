"use strict";

module.exports = async (ctx, next) => {
  if (
    ctx.state.user &&
    ctx.state.user.email === "nextjs@mdcuresearchclub.thew.pro"
  ) {
    // verify permission
    // source: packages/strapi-plugin-users-permissions/config/policies/permissions.js
    const role = ctx.state.user.role;
    const route = ctx.request.route;
    const permission = await strapi
      .query("permission", "users-permissions")
      .findOne(
        {
          role: role.id,
          type: route.plugin || "application",
          controller: route.controller,
          action: route.action,
          enabled: true,
        },
        []
      );

    if (!permission) {
      return ctx.forbidden("Nextjs is forbidden!");
    }
  }
  return await next();
};
