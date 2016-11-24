var express = require('express')
var router = express.Router()

/* GET em /users/ */
router.get('/', function(req, res, next) {
  res.send('listagem dos usuários')
})

/* GET em /users/:id */
router.get('/:id', function(req, res, next) {
  const id = req.paramas.id
  res.send('consulta 1 usuário pelo seu id = ${id}')
})

module.exports = router
