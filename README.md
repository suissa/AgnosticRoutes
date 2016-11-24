# Agnostic Routes

Projeto destinado a criar um padráo de criação de rotas agnósico onde as mesmas possam ser usadas em qualquer framework de Node.js

Para criarmos tal padrão precisamos entender quais sao as informações necessarias para qualquer rota, vamos pegar o exemplo criado pelo `express-generator`:


```js
var express = require('express')
var router = express.Router()

router.get('/', function(req, res, next) {
  res.send('listagem dos usuários')
})

router.get('/:id', function(req, res, next) {
  const id = req.paramas.id
  res.send('consulta 1 usuário pelo seu id = ${id}')
})
```

Nisso podemos perceber que temos os seguintes elementos:

- router: `express.Router()`
- method: `get`
- path: `/`, `/:id`
- callback: `function(req, res, next)`


Entao podemos inicialmente separar o *Router* para que o mesmo possa ser usado por qualquer framework, para fazer isso é facil basta modularizarmos ele assim:

```js
module.exports = require('express').Router()
```

Dessa forma o código ficara assim:


```js
var router = require('./routerExpress')

router.get('/', function(req, res, next) {
  res.send('listagem dos usuários')
})

router.get('/:id', function(req, res, next) {
  const id = req.paramas.id
  res.send('consulta 1 usuário pelo seu id = ${id}')
})
```

Agora vamos separar nossas *actions*/funcões das rotas para que possamos reutiliza-las em outras rotas, antes disso vamos refatorar para ES6:

```js
var router = require('./routerExpress')

router.get('/', (req, res, next) => {
  res.send('listagem dos usuários')
})

router.get('/:id', (req, res, next) => {
  const id = req.paramas.id
  res.send('consulta 1 usuário pelo seu id = ${id}')
})
```

E agora podemos imaginar que essas funções vem de outro lugar, entõ só precisamos usar:


```js
var router = require('./routerExpress')

router.get('/', listar)
router.get('/:id', consultar)
```

Sabendo disso basta separarmos o método da rota, para fazer isso podemos criar um JSON para isso:

```js
const listar = require('./actions/listar')
const consultar = require('./actions/consultar')

const routes = [
  { method: 'get', path: '/', action: listar},
  { method: 'get', path: '/:id', action: consultar}
]
```

E agora basta criarmos uma função que crie essas rotas utilizando esse JSON.

> Como você acha a melhor forma de fazer isso?

Na minha concepção podemos usar um `forEach`, pois não precisamos criar um *Array* novo, apenas precisamos iterar nele para pegaramos seus dados:

```js
const createRoutes = (route, index) => router[route.method](route.path, route.action)
routes.forEach(createRoutes)
```

 A magica acontece aqui: `router[route.method](route.path, route.action)`. Onde usamos o módulo de `router` utilizando sua funçao com `router[route.method]`, passando qual sua rota com `route.path` e qual ação será executada com `route.action`.

Iremos injetar o *Model* no módulo `Actions` pois ele que exportará nossas funções a serem utilizadas pelas rotas, esse módulo ficarás assim:

```
const callback = function (err, data, res) {
  if (err) throw new Error(err)

  return res.json(data)
}

module.exports = (Model) => {
  
  const Actions = {}
  
  Actions.listar = (req, res) => {
    const query = {}
    Model.find(query, (err, data) => {
      callback(err, data, res)
    })
  }
  Actions.consultar = (req, res) => {
    const query = {_id: req.params.id}
    Model.findOne(query, (err, data) => {
      callback(err, data, res)
    })
  }
  Actions.alterar = (req, res) => {
    const query = {_id: req.params.id}
    const body = req.body
    Model.update(query, body, (err, data) => {
      callback(err, data, res)
    })
  }
  Actions.remover = (req, res) => {
    const query = {_id: req.params.id}
    Model.remove(query, (err, data) => {
      callback(err, data, res)
    })
  }
  Actions.cadastrar = (req, res) => {
    const body = req.body
    Model.create(body, (err, data) => {
      callback(err, data, res)
    })
  }

  return Actions
}
```

Perceba que cada função só será definida a partir do *Model* que foi injetado, logo mais modularizaremos essas funções também.

Após termos as *Actions* precisamos injeta-las no módulo `Routes` onde estarao as definições da rotas

```js
module.exports = (Actions) => {
  const Routes = [
    {
      method: 'get',
      path: '/',
      action: Actions['listar']
    },
    {
      method: 'get',
      path: '/:id',
      action: Actions['consultar']
    }
  ]
  return Routes
}
```

E p

```js
const Router = require('./routesExpress')(Routes, router)
```
