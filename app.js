var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['products']);
var ObjectId = mongojs.ObjectId;
var app = express();

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//set static path
app.use(express.static(path.join (__dirname, 'public')));
 
 //global vars
 app.use(function(req, res, next){
     res.locals.errors = null;
     next();

 });


//express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.'),
       root    = namespace.shift(), 
       formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));



app.get('/', function(req, res){

	db.products.find(function (err, docs) {
	res.render('index', {
		title: 'Ecommerce',
		products: docs
		});

})
});


app.post('/products/add', function(req, res){

	req.checkBody('description', 'description is required').notEmpty();
	req.checkBody('Price', 'Price is required').notEmpty();
	req.checkBody('name', 'name is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
         res.render('index', {
		title: 'Ecommerce',
		products: products,
		errors: errors
		});
        } else{
    	var newProduct = { 
		description: req.body.description,
		Price: req.body.Price,
		name: req.body.name
	}

	db.products.insert(newProduct, function(err, result){
		if(errors){
			console.log(err);
		}
		res.redirect('/');
	});


    }
});

app.delete('/products/delete/:id',function(req, res){
 db.products.remove({_id: ObjectId(req.params.id)}, function(err, result){
 	if(err){
 		console.log(err);
 	}
 	res.redirect('/');
 })
});

app.listen(3000, function(){
	console.log('server listening at port 3000..');
})



