const config = require('../package.json');
const gitignore = require('fs').readFileSync('.gitignore').toString().split('\n').filter(value => value);

module.exports = {
    'name': config.name,
    'script': 'index.js',
    'exec_mode': 'cluster',
    'instances': 1,
    'node_args': '--max_old_space_size=256',
    'max_memory_restart': '512M',
    'max_restarts': 3,
    'restart_delay': 1000,
    'min_uptime': 3000,
    'error_file': 'logs/error.log',
    'out_file': 'logs/output.log',
    'watch': true,
    'ignore_watch': gitignore,
};