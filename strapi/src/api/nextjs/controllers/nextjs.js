"use strict";

/**
 * A set of functions called "actions" for `nextjs`
 */

module.exports = {
  login: async (ctx, next) => {
    if (
      ctx.state.auth.strategy.name != "api-token" ||
      ctx.state.auth.credentials.name != "Nextjs"
    ) {
      return ctx.unauthorized(`You're not Nextjs!`);
    }

    const params = ctx.request.body;

    // Email is required.
    if (!params.email) {
      return ctx.badRequest("Please provide your email.");
    }

    // Username is required.
    if (!params.username) {
      return ctx.badRequest("Please provide your username.");
    }

    const userService = strapi.service("plugin::users-permissions.user");
    let user = (await userService.fetchAll({ email: params.email }))[0];
    console.log(user);

    if (user) {
      // Update existing user updatedAt
      userService.edit(user.id, { updatedAt: new Date() });
    } else {
      // Create new user
      const newUser = {
        username: params.username,
        email: params.email,
      };

      const role = await await strapi
        .query("plugin::users-permissions.role")
        .findOne({ where: { type: "docchula" } });

      let roleId;
      if (role) {
        roleId = role.id;
      } else {
        roleId = (
          await strapi.service("plugin::users-permissions.role").createRole({
            name: "Docchula",
            description: "Nextjs docchula user",
            type: "docchula",
          })
        ).id;
      }

      const existingUsername = await userService.fetch({
        username: params.username,
      });

      if (existingUsername) {
        newUser.username += " " + Math.floor(Math.random() * 1000);
      }

      user = await userService.add({
        ...newUser,
        role: roleId,
      });
    }
    const jwt = strapi
      .service("plugin::users-permissions.jwt")
      .issue(
        { id: user.id, username: user.username, email: user.email },
        { expiresIn: "6h" }
      );

    return {
      jwt,
    };
  },
};
