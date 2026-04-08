import adminRoute from 'admin.controller.js';


export const apiController = (app) => {
  app.use('/', adminRoute); //routers
};
