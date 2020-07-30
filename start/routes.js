'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
});

/** Sync Github Route */
Route.get("/api/v1/projects/sync", "ProjectController.indexSyncGitHub");

/** Phase 1 / average statistics issues Route */
Route.get("/api/v1/projects/average", "ProjectController.averages");

/** Phase 2 / daily statistics issues Route */
Route.get("/api/v1/projects/statistics", "ProjectController.statistics");
