const config = require('../package.json');

module.exports = {
    name: config.name,
    script: 'index.js',
    exec_mode: 'cluster',
    instances: 1,
    node_args: '--max_old_space_size=512 --harmony --trace-deprecation --use_strict',
    max_memory_restart: '512M',
    max_restarts: 3,
    restart_delay: 1000,
    min_uptime: 3000,
    error_file: 'logs/error.log',
    out_file: 'logs/output.log',
    watch: ['index.js', 'config/', 'api/', 'services/', 'models/'],
    env: {
        NODE_ENV: 'development',
    },
    env_staging: {
        NODE_ENV: 'staging',
    },
    env_production: {
        NODE_ENV: 'production',
    }
};