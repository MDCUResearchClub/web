'use strict';

/**
 * researcher service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::researcher.researcher');
