import adminRoute from './admin.controller.js';
import announcementRoute from './announcement.controller.js';
import programRoute from './program.controller.js'
import officeRoute from './office.controller.js';
import facultyRoute from './faculty.controller.js';
import courseRoute from './course.controller.js';
import testimonyRoute from './testimony.controller.js';
import coursePoolRoute from './course-pool.controller.js';
import studyPlanRoute from './study-plan.controller.js';

export const apiController = (app) => {
  app.use('/', adminRoute); //routers
  app.use('/', programRoute);
  app.use('/', officeRoute);
  app.use('/', announcementRoute);
  app.use('/', facultyRoute);
  app.use('/', courseRoute);
  app.use('/', testimonyRoute);
  app.use('/programs/:program_id', coursePoolRoute);
  app.use('/programs/:program_id', studyPlanRoute);
};
