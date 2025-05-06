module.exports = (app) => {

    var { authJwt } = require("../middleware");
    
    const user = require('../controller/user.controller');
    
    app.get('/api/listUsers',  [authJwt.verifyToken], user.findAll);

    app.post('/api/addUser',  [authJwt.verifyToken], user.create);

    app.post('/api/updateUser/:id',  [authJwt.verifyToken], user.update);

    app.post('/api/deleteUser/:id',  [authJwt.verifyToken], user.delete);

    app.get('/api/user/:id',  [authJwt.verifyToken], user.findById);

    app.get('/api/user/name/:name',  [authJwt.verifyToken], user.findByName);
};