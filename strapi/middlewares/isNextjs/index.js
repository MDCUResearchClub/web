module.exports = (strapi) => {
  return {
    initialize() {
      strapi.app.use(async (ctx, next) => {
        // request has "nextjs" header
        // https://stackoverflow.com/questions/3561381/custom-http-headers-naming-conventions
        if (ctx.request && ctx.request.header && ctx.request.header.nextjs) {
          // check nextjs token
          if (
            ctx.request.header.nextjs ===
            strapi.config.get("server.admin.auth.nextjs")
          ) {
            // set user as "nextjs@mdcuresearchclub.thew.pro"
            ctx.state.user = await strapi.plugins[
              "users-permissions"
            ].services.user.fetch({
              email: "nextjs@mdcuresearchclub.thew.pro",
            });

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
              return ctx.forbidden("You're not Nextjs!");
            }

            return await next();
          }
          // wrong nextjs token
          return ctx.unauthorized(`You're not Nextjs!`);
        }
        // not nextjs user
        return await next();
      });
    },
  };
};
