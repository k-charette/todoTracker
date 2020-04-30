const functions = require('firebase-functions');
const app = require('express')();
const auth = require('./util/auth')

// All API calls will be done via the getAllTodos function
const { getAllTodos, postOneTodo, deleteTodo, editTodo } = require('./APIs/todos')
const { loginUser, signUpUser, uploadProfilePhoto, getUserDetail, updateUserDetails } = require('./APIs/users')

// Assigning getAllTodos function to the /todos route 
app.get('/todos', auth, getAllTodos);
app.post('/todo', auth, postOneTodo);
app.delete('/todo/:todoId', auth, deleteTodo);
app.put('/todo/:todoId', auth, editTodo);
app.post('/login', loginUser)
app.post('/signup', signUpUser)
app.post('/user/image', auth, uploadProfilePhoto)
app.get('/user', auth, getUserDetail)
app.post('/user', auth, updateUserDetails)

exports.api = functions.https.onRequest(app);