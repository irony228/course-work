module.exports = (app) => {

    var { authJwt } = require("../middleware");
    
    const status = require('../controller/status.controller');
    
    app.get('/api/statuses',  [authJwt.verifyToken], status.findAll);

    app.post('/api/addStatus',  [authJwt.verifyToken], status.create);

    app.post('/api/updateStatus/:id',  [authJwt.verifyToken], status.update);

    app.post('/api/deleteStatus/:id',  [authJwt.verifyToken], status.delete);

    app.get('/api/status/:id',  [authJwt.verifyToken], status.findById);

    app.get('/api/status/name/:entity_type',  [authJwt.verifyToken], status.findByType);
};