module.exports = (app) => {

    const type = require('../controller/type.controller');
    
    app.get('/api/types', type.findAll);

    app.post('/api/addType', type.create);

    app.post('/api/updateType/:id', type.update);

    app.post('/api/deleteType/:id', type.delete);

    app.get('/api/type/:id', type.findById);

    app.get('/api/type/name/:name', type.findByName);
};