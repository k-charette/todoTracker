const functions = require('firebase-functions');
const app = require('express')();
const auth = require('./util/auth')

// All API calls will be done via the getAllTodos function
const { getAllTodos, postOneTodo, deleteTodo, editTodo } = require('./APIs/todos')
const { loginUser, signUpUser, uploadProfilePhoto } = require('./APIs/users')

// Assigning getAllTodos function to the /todos route 
app.get('/todos', getAllTodos);
app.post('/todo', postOneTodo);
app.delete('/todo/:todoId', deleteTodo);
app.put('/todo/:todoId', editTodo);
app.post('/login', loginUser)
app.post('/signup', signUpUser)
app.post('/user/image', auth, uploadProfilePhoto)

exports.api = functions.https.onRequest(app);