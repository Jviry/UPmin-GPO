import adminRoute from './admin.controller.js';
import programRoute from './program.controller.js'
import officeRoute from './office.controller.js';

export const apiController = (app) => {
  app.use('/', adminRoute); //routers
  app.use('/', programRoute);
  app.use('/', officeRoute);
}
