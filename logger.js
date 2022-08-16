const log4js = require('log4js');

log4js.configure({
    appenders: {
        console: { type: 'console'},
        fileWarning: { type: 'file', filename: 'warning.log'},
        fileError: { type: 'file', filename: 'error.log'},
        onlyConsole: { type: 'logLevelFilter', appender: 'console', level: 'info'},
        onlyWarning: { type: 'logLevelFilter', appender: 'fileWarning', exclude: 'error', level: 'warn'},
        onlyError: { type: 'logLevelFilter', appender: 'fileError', level: 'error'},
    },
    categories: {
        default: { appenders: ['onlyConsole', 'onlyWarning', 'onlyError'], level: 'info' } 
    }
})

module.exports = log4js.getLogger();