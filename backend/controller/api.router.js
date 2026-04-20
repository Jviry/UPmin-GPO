import adminRoute from './admin.controller.js';
import announcementRoute from './announcement.controller.js';
import officeRoute from './office.controller.js';

export const apiController = (app) => {
  app.use('/', adminRoute); //routers
  app.use('/', officeRoute);
  app.use('/', announcementRoute);
};
