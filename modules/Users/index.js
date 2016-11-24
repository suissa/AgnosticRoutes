const Model = require('./model')
const router = require('./routerExpress')
const Actions = require('./actions')(Model)
const Routes = require('./routes')(Actions)
const Router = require('./routesExpress')(Routes, router)

module.exports = Router
