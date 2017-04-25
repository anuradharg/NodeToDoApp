var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Connect to the database
//Original string - mongodb://<dbuser>:<dbpassword>@ds161580.mlab.com:61580/tododb
mongoose.connect('mongodb://test:test@ds161580.mlab.com:61580/tododb');

//Create a schema - this is like a blueprint
var todoSchema = new mongoose.Schema({
  item: String
});

//Create a model
var Todo = mongoose.model('Todo', todoSchema);

//Create data based on model
/*
var itemOne = Todo({item: 'Buy flowers'}).save(function(err){
  if (err) throw err;
  console.log('item saved');
})
*/

//var data = [{item: 'get milk'},{item: 'walk dog'},{item: 'do coding'}];
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){

  app.get('/todo',function(req, res){
    //get data from mongo db and pass it to view.
    Todo.find({}, function(err, data){
      if (err) throw err;
      res.render('todo', {todos: data});
    });
  });

  app.post('/todo', urlencodedParser, function(req,res){
    //get data from the view and add it to mongo db.
    var newTodo = Todo(req.body).save(function(err, data){
      if (err) throw err;
      res.json(data);
    })

    //data.push(req.body);
    //res.json(data);
  });

  app.delete('/todo/:item',function(req,res){
    //delete the requested item from mongo db.
    Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data){
      if (err) throw err;
      res.json(data);
    });

    /*
    data = data.filter(function(todo){
      return todo.item.replace(/ /g, "-") != req.params.item;
    })
    res.json(data);
    */
  });
}
