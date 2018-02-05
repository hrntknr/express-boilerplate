const log4js = require('log4js')
const config = require('config')

const log4JsConfig = {
  appenders: {
    error: {
      type: 'dateFile',
      filename: config.logPath.error
    },
    access: {
      type: 'dateFile',
      filename: config.logPath.access
    },
    system: {
      type: 'dateFile',
      filename: config.logPath.system
    },
    console: {
      type: 'console'
    }
  },
  categories: {
    default: {
      appenders: ['console'],
      level: 'ALL'
    },
    error: {
      appenders: ['error', 'console'],
      level: 'ALL'
    },
    access: {
      appenders: ['access', 'console'],
      level: 'ALL'
    },
    system: {
      appenders: ['system', 'console'],
      level: 'ALL'
    }
  }
}


log4js.configure(log4JsConfig)

module.exports = {
  access: log4js.getLogger('access'),
  system: log4js.getLogger('system'),
  error: log4js.getLogger('error'),
  express: log4js.connectLogger(log4js.getLogger('access'), {level: log4js.levels.INFO})
}