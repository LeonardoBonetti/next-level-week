import express from 'express';


const app = express();

app.get('/users', (request, response) => {
    response.json({user:'leonardo bonetti s'});
});

app.listen(3333);