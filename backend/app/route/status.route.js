module.exports = (app) => {

    const status = require('../controller/status.controller');
    
    app.get('/api/statuses', status.findAll);

    app.post('/api/addStatus', status.create);

    app.post('/api/updateStatus/:id', status.update);

    app.post('/api/deleteStatus/:id', status.delete);

    app.get('/api/status/:id', status.findById);
};