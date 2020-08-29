"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  async loginUser(ctx) {
    const usersPlugin = strapi.plugins["users-permissions"];
    const params = ctx.request.body;

    // Email is required.
    if (!params.email) {
      return ctx.badRequest("Please provide your email.");
    }

    // Username is required.
    if (!params.username) {
      return ctx.badRequest("Please provide your username.");
    }

    let user = await strapi
      .query("user", "users-permissions")
      .findOne({ email: params.email });

    if (!user) {
      const newUser = {
        username: params.username,
        email: params.email,
      };

      const role = await strapi
        .query("role", "users-permissions")
        .findOne({ type: "docchula_user" });

      let roleId;
      if (role) {
        roleId = role.id;
      } else {
        const defaultRoleType = await strapi
          .store({
            environment: "",
            type: "plugin",
            name: "users-permissions",
            key: "advanced",
          })
          .get().default_role;
        const defaultRole = await strapi
          .query("role", "users-permissions")
          .findOne({ type: defaultRoleType });
        roleId = defaultRole.id;
      }

      const existingUsername = await usersPlugin.services.user.fetch({
        username: params.username,
      });
      if (existingUsername) {
        newUser.username += " " + Math.floor(Math.random() * 1000);
      }
      user = await usersPlugin.services.user.add({
        ...newUser,
        role: roleId,
      });
    }

    const jwt = usersPlugin.services.jwt.issue({ id: user.id }, {"expiresIn": "15m"});

    return {
      jwt,
      user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
        model: usersPlugin.models.user,
      }),
    };
  },
};
