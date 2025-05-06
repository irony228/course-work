module.exports = (app) => {

    var { authJwt } = require("../middleware");

    const type = require('../controller/type.controller');
    
    app.get('/api/types',  [authJwt.verifyToken], type.findAll);

    app.post('/api/addType',  [authJwt.verifyToken], type.create);

    app.post('/api/updateType/:id',  [authJwt.verifyToken], type.update);

    app.post('/api/deleteType/:id',  [authJwt.verifyToken], type.delete);

    app.get('/api/type/:id',  [authJwt.verifyToken], type.findById);

    app.get('/api/type/name/:name',  [authJwt.verifyToken], type.findByName);
};