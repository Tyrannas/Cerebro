module.exports = {
  apps : [{
    name: 'snake-server',
    script: 'back/games/snake/server.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  },{
    name: 'snake-bots',
    script: 'clientTemplate/defaultBot.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'aibattle',
      host : '213.32.64.83',
      ref  : 'origin/prod',
      repo : 'git@github.com:Tyrannas/Cerebro.git',
      path : '/var/www/ai-battle',
      'post-deploy' : './pm2-build.sh && pm2 reload ecosystem.config.js --env production'
    }
  }
};
