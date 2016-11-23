module.exports = (Actions) => {
  const Routes = [
    require('./routes/get.listar')(Actions),
    require('./routes/get.consultar')(Actions),
    require('./routes/put.alterar')(Actions),
    require('./routes/delete.remover')(Actions),
    require('./routes/post.cadastrar')(Actions)
  ]
  return Routes
}
