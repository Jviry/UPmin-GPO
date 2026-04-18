import adminRoute from './admin.controller.js';
import announcementRoute from './announcement.controller.js';

export const apiController = (app) => {
  app.use('/', adminRoute); //routers
  app.use('/', announcementRoute); 
};
