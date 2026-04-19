import adminRoute from './admin.controller.js';
import programRoute from './program.controller.js'

export const apiController = (app) => {
  app.use('/', adminRoute); //routers
  app.use('/', programRoute);
};
