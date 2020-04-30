const functions = require('firebase-functions');
const app = require('express')();


// All API calls will be done via the getAllTodos function
const { getAllTodos, postOneTodo, deleteTodo } = require('./APIs/todos')

// Assigning getAllTodos function to the /todos route 
app.get('/todos', getAllTodos);
app.post('/todo', postOneTodo);
app.delete('/todo/:todoId', deleteTodo);


exports.api = functions.https.onRequest(app);