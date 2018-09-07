// 适配器
const fileCache = require('think-cache-file');
const fileSession = require('think-session-file');
const {Console, File, DateFile} = require('think-logger3');
const path = require('path');
const isDev = think.env === 'development';
const socketio = require('think-websocket-socket.io');
const redis = require('socket.io-redis');
/**
 * 缓冲
 * cache adapter config
 * @type {Object}
 */
exports.cache = {
  type: 'file',
  common: {
    timeout: 24 * 60 * 60 * 1000 // millisecond毫秒
  },
  file: {
    handle: fileCache,
    cachePath: path.join(think.ROOT_PATH, 'runtime/cache'), // absoulte path is necessarily required缓冲文件存放目录
    pathDepth: 1,
    gcInterval: 24 * 60 * 60 * 1000 // gc interval 清理过期缓冲定时时间
  }
};

/**
 * 关系数据库Mysql
 * model adapter config
 * @type {Object}
 */
exports.model = require('./model');

/**
 * 会话
 * session adapter config
 * @type {Object}
 */
exports.session = {
  type: 'file',
  common: {
    cookie: {
      name: 'thinkjs',
      keys: ['signature key'],
      signed: true
    }
  },
  file: {
    handle: fileSession,
    sessionPath: path.join(think.ROOT_PATH, 'runtime/session')
  }
};

/**
 * 视图
 * view adapter config
 * @type {Object}
 */
// 视图的 adapter 名称为 view
exports.view = require('./view');

/**
 * 日志输出
 * logger adapter config
 * @type {Object}
 */
exports.logger = {
  type: isDev ? 'console' : 'dateFile',
  console: {
    handle: Console
  },
  file: {
    handle: File,
    backups: 10, // max chunk number
    absolute: true,
    maxLogSize: 50 * 1024, // 50M
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  },
  dateFile: {
    handle: DateFile,
    level: 'ALL',
    absolute: true,
    pattern: '-yyyy-MM-dd',
    alwaysIncludePattern: true,
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  }
};
/**
 * webSocket 服务
 *
 * @type {{type: string, common: {}, socketio: {handle: *, allowOrigin: string, path: string, adapter: null, messages: *[]}}}
 */
exports.websocket = {
    type: 'socketio',
    common: {
        // common config
    },
    socketio: {
        handle: socketio,
        allowOrigin: '127.0.0.1:8360',  // 默认所有的域名都允许访问
        path: '/socket.io',             // 默认 '/socket.io'
        adapter: redis({ host: 'localhost', port: 6379 }),                  // 默认无 adapter
        messages: [{
            open: '/websocket/open', // 建立连接时处理对应到 websocket Controller 下的 open Action
            close: '/websocket/close',     // 关闭连接时处理的 Action
            addUser: '/websocket/addUser'
        }]
    }
}
