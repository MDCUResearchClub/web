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

    if (user) {
      // Update existing user
      await usersPlugin.services.user.edit(
        { id: user.id },
        {
          username: params.username,
          email: params.email,
          // update 'confirmationToken' to update the 'updated_at' attribute (NonWritableAttributes by Strapi)
          // https://github.com/strapi/strapi/blob/db6a77697779dcd3434e295f5689faa15080c775/packages/strapi-utils/lib/content-types.js#L61
          confirmationToken: String(Date.now()),
        }
      );
    } else {
      // Create new user
      const newUser = {
        username: params.username,
        email: params.email,
        confirmationToken: String(Date.now()),
      };

      const role = await strapi
        .query("role", "users-permissions")
        .findOne({ type: "docchula_user" });

      let roleId;
      if (role) {
        roleId = role.id;
      } else {
        const defaultRoleType = (
          await strapi
            .store({
              environment: "",
              type: "plugin",
              name: "users-permissions",
              key: "advanced",
            })
            .get()
        ).default_role;
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

    const jwt = usersPlugin.services.jwt.issue(
      { id: user.id },
      { expiresIn: "15m" }
    );

    return {
      jwt,
      user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
        model: usersPlugin.models.user,
      }),
    };
  },
};
