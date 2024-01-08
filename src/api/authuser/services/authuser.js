'use strict';

/**
 * authuser service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::authuser.authuser');
