const functions = require('firebase-functions');
const app = require('express')();


// Assigning getAllTodos function to the /todos route 

// All API calls will be done via the getAllTodos function
const { getAllTodos } = require('./APIs/todos')

app.get('/todos', getAllTodos);
exports.api = functions.https.onRequest(app);