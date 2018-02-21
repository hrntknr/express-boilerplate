#!/usr/bin/env node
const http = require('http')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const {logger} = require('./lib')
const cookieParser = require('cookie-parser')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger.express)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const index = require('./routes/index')
app.use('/', index)

app.use((req, res, next)=>{
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function(err, req, res, next) { //eslint-disable-line
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.render('error')
  if(err.status == 500)logger.error.error(err.stack)
})

process.on('unhandledRejection', (err) => {
  logger.error.error(err.stack)
})

const port = process.env.port || 3000
app.set('port', port)
const server = http.createServer(app)
server.listen(port)
server.on('listening', ()=>{
  const addr = server.address()
  const address = addr.family=='IPv6'?`[${addr.address}]`:addr.address
  logger.system.info(`Listening on ${address}:${addr.port}`)
})
server.on('error', (err)=>{
  logger.error.error(err.stack)
  throw err
})