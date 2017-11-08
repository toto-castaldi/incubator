const simpleAutoreloadServer = require('simple-autoreload-server');

const server = simpleAutoreloadServer({
    port            : 8008,
    path            : './site', //'./',
    listDirectory   : true,
    watch           : '**/**', //"*.{png,js,html,json,swf}",
    reload          : '**/**'//"{*.json,static.swf}"
});