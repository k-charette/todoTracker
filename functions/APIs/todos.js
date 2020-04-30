const { db } = require('../util/admin')

exports.getAllTodos = (request, response) => {
    db.collection('todos').orderBy('createdAt', 'desc').get().then((data) => {
        let todos = []
        data.forEach((doc) => {
            todos.push({
                todoId: doc.id,
                title: doc.data().title,
                body: doc.data().body,
                createdAt: doc.data().createdAt
            })
        })
        return response.json(todos)
    })
    .catch((err) => {
        console.log(err)
        return response.status(500).json({ error: err.code })
    })
}

exports.postOneTodo = (request, response) => {
    if(request.body.body.trim() === ''){
        return response.status(400).json({ body: 'Must not be empty' })
    }

    if(request.body.title.trim() === ''){
        return response.status(400).json({ title: 'Must not be empty' })
    }

    const newToDoItem = {
        title: request.body.title,
        body: request.body.body,
        createdAt: new Date().toISOString()
    }

    db.collection('todos').add(newToDoItem).then((doc) => {
        const responseToDoItem = newToDoItem
        responseToDoItem.id = doc.id
        return response.json(responseToDoItem)
    })
    .catch((err) => {
        response.status(500).json({ error: 'Danger Will Robinson' })
        console.error(err)
    })
}

exports.deleteTodo = (request, response) => {
    const document = db.doc(`/todos/${request.params.todoId}`)

    document.get().then((doc) => {
        if (!doc.exists) {
            return response.status(400).json({ error: 'Where my todo at?'})
        }
        return document.delete()
    })
    .then(() => {
        response.json({ message: 'Begone Todo!'})
    })
    .catch((err) => {
        console.error(err)
        return response.status(500).json({ error: err.code })
    })
}

exports.editTodo = ( request, response ) => { 
    if(request.body.todoId || request.body.createdAt){
        response.status(403).json({message: 'Not allowed to edit'});
    }
    let document = db.collection('todos').doc(`${request.params.todoId}`);
    // TO CHECK -> before had it as document.update(request.body) 
    // BUT giving an error "Update() requires either a single JavaScript object or an alternating list of field/value pairs
    //that can be followed by an optional precondition."
    document.update({title: true, body: true})
    .then(()=> {
        response.json({message: 'Updated successfully'});
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ 
                error: err.code 
        });
    });
};