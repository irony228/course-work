module.exports = (app) => {

    const capacity = require('../controller/capacity.controller');
    
    app.get('/api/capacities', capacity.findAll);

    app.post('/api/addCapacity', capacity.create);

    app.post('/api/updateCapacity/:id', capacity.update);

    app.post('/api/deleteCapacity/:id', capacity.delete);

    app.get('/api/capacity/:id', capacity.findById);

    app.get('/api/capacity/name/:name', capacity.findByName);
};