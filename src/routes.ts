import {Express} from 'express';
import usersController from './controllers/users.controller';
import authController from './controllers/auth.controller';
import topicsController from './controllers/topics.controller';
import requestTopicsController from './controllers/request-topics.controller';
import reportsController from './controllers/reports.controller';
import authMiddleware from './middleware/auth.middleware';
import quotaController from './controllers/quota.controller';

const routes = (app: Express) => {
  app.route('/').get((_, res) => {
    res.send(`API server is running (${new Date()})`);
  });

  app.route('/user').get(authMiddleware.authMiddleware, usersController.getUserProfile);

  app.route('/auth').post(authController.login);

  app.route('/topics').get(topicsController.getTopics);

  app.route('/reports').get(reportsController.getReports);

  app.route('/reports/:id').get(reportsController.getReportById);

  app.route('/reports').post(reportsController.createReport);

  // validate admin auth middleware
  app.route('/request-topics').get(requestTopicsController.getRequestTopics);
  // validate user auth middleware
  app
    .route('/request-topics')
    .post(requestTopicsController.createRequestTopics);

  // validate admin auth middleware
  app.route('/request-topics/:id').get(requestTopicsController.getRequestTopic);
  // validate admin auth middleware
  app
    .route('/request-topics/:id')
    .put(requestTopicsController.updateStatusRequestTopics);

  app.route('/quota/:username').get(quotaController.getUserQuota);

  app.route('/quota/:username').post(quotaController.updateUserQuota);
};

export default routes;
