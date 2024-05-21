const _ = require("lodash");
const utils = require("@strapi/utils");
const { getService, validateEmailConfirmationBody } = require("@strapi/plugin-users-permissions/strapi-server");

const { ValidationError, ApplicationError } = utils.errors;
const { sanitize } = utils;
const sanitizeUser = (user, ctx, userSchema) => {
  const { auth } = ctx.state;
  return sanitize.contentAPI.output(user, userSchema, { auth });
};

module.exports = plugin => {
  plugin.controllers.auth.emailConfirmation = async (ctx, next, returnUser) => {
    const { confirmation: confirmationToken } = await validateEmailConfirmationBody(ctx.query);

    const userService = getService("user");
    const jwtService = getService("jwt");

    const [user] = await userService.fetchAll({
      filters: { confirmationToken }
    });

    if (!user) {
      throw new ValidationError("Invalid token");
    }

    await userService.edit(user.id, {
      confirmed: true,
      confirmationToken: null
    });
///-----------------------------------
console.log('===================ctx=', ctx)
console.log('===================user=', user)
console.log('===================returnUser=', returnUser)

const role = await strapi
  .query('plugin::users-permissions.role')
  .findOne({ where: { name: "Authenticated" } });

if (!role) {
  throw new ApplicationError('Impossible to find the default role');
}

const roleId = role.id;
const priceId = 1;
const walletId = await strapi.controllers["api::wallet.wallet"].createDefaultWalletDirectly(user.id);

await strapi.entityService.update('plugin::users-permissions.user', user.id, {
    data: {
        role                       : roleId,
        wallet                     : walletId,
        registration_device_price  : priceId
    }
})

  //Модифицируем юзера
      //назначаем роль
      //создаём кошелёк
      //назначаем цену
      /////////////////--------------------
    if (returnUser) {
      const userSchema = strapi.getModel("plugin::users-permissions.user");
      ctx.send({
        jwt: jwtService.issue({ id: user.id }),
        user: await sanitizeUser(user, ctx, userSchema)
      });
    } else {
      const settings = await strapi.store({ type: "plugin", name: "users-permissions", key: "advanced" }).get();

      ctx.redirect(settings.email_confirmation_redirection || "/");
    }
  };

  return plugin;
};