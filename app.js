var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var logger = require('morgan');
var fs = require('fs');

var request = require('request');
var options = {
  host: 'localhost',
  port: '3000',
  path: '/books'
};


/**
** Create Headers to give access 
**/
app.use(function(req, res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, sid");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
    next();
});

/**
** Select Template Engine (ejs) 
**/
app.set('view engine', 'ejs');    
app.set('views', path.join(__dirname, 'views'));

/**
** Manage upload and storage
**/
var multer = require('multer');
var upload = multer({dest: 'uploads/'});

/**
** Make public folder available 
**/
var publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

/**
** Configure body-parser 
**/
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
** Routes
**/
var books = {}; 

app.get('/', function(req, res) { 
    
    request.get('http://'+options.host + ':' + options.port + options.path, function(err,rs,body){
      //if(err) //TODO: handle err
      //if(res.statusCode !== 200 ) //etc
      //TODO Do something with response
          books = rs.body;
          console.log(rs.body);
    });   
    
    res.render('index', {
        title: 'DevX Lab Books in Express and JsonDB', 
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius pariatur veritatis fugit vero deserunt omnis quas, voluptas maxime, non commodi, asperiores quis cum autem rerum. Excepturi provident aliquid, praesentium dolore.',
        page_title: 'Homepage',
        page_desc: '',
        books: books
    });
    
});

app.get ('/books', function(req, res) {
    
    request.get('http://'+options.host + ':' + options.port + options.path, function(err,rs,body) {
      //if(err) //TODO: handle err
      //if(res.statusCode !== 200 ) //etc
      //TODO Do something with response
          books = JSON.parse(rs.body);
          ///console.log( books );
        
       if (err){
           throw err;
       } 
    
        res.render('books/index', {
            title: 'DevX Lab Books in Express and JsonDB', 
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius pariatur veritatis fugit vero deserunt omnis quas, voluptas maxime, non commodi, asperiores quis cum autem rerum. Excepturi provident aliquid, praesentium dolore.',
            page_title: 'Books Listing',
            page_desc: '', 
            books: books
        });
    }); 
    
});

app.get ('/books/:_id', function(req, res){
    
    request.get('http://'+options.host + ':' + options.port + options.path + '/'+req.params._id, function(err,rs,body) {
      //if(err) //TODO: handle err
      //if(res.statusCode !== 200 ) //etc
      //TODO Do something with response
          book = JSON.parse(rs.body);
          ///console.log( books );
        
       if (err){
           throw err;
       } 
    
        res.render('books/details', {
            title: 'DevX Lab Books in Express and JsonDB', 
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius pariatur veritatis fugit vero deserunt omnis quas, voluptas maxime, non commodi, asperiores quis cum autem rerum. Excepturi provident aliquid, praesentium dolore.',
            page_title: 'Books Listing',
            page_desc: '', 
            book: book
        });
    }); 
});

app.get ('/book/del/:_id', function(req, res){
    Book.delBook(req.params._id, function(err, book){
       if (err){
           throw err;
       } 
        
        //res.json(book);
        res.send('Book id: '+req.params._id+' deleted! <br/><a href="/books">Go to Books List</a>.');
        
        console.log('Book id: '+req.params._id+' deleted!');
    });
});

app.get ('/book/add', function(req, res){
        
    res.render('books/add', {
        title: 'DevX Lab Books in Express and JsonDB', 
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius pariatur veritatis fugit vero deserunt omnis quas, voluptas maxime, non commodi, asperiores quis cum autem rerum. Excepturi provident aliquid, praesentium dolore.',
        page_title: 'Add a Book',
        page_desc: ''
    });
    
});

app.post('/book/add', upload.any(), function(req, res, next){
    
    if (req.body.title && req.body.genre) {
        if (req.files[0]) {
            if (req.files[0].originalname) {

                req.files.forEach(function(file) {
                    console.log(file);
                    var filename = (new Date).valueOf()+"."+file.originalname;
                    console.log(filename);
                    console.log(file.path);
                        fs.rename(file.path, 'public/uploads/'+filename, function(err){
                            if (err) throw err;

                            var book = req.body;
                                book['img_url'] = filename;
                                console.log(book);

                            Book.addBook(book, function(err, book){
                               if (err){
                                   //throw err;
                                   return next(book);
                               } 

                                res.json(book);
                                console.log('file uploaded...');
                            });
                        });
                });
        
            } else {
                res.send('File is required.');
                console.log(req.files);
            } 
        } else {
            res.end('No files selected.');
            console.log(req.files);
        }
    } else {
        res.send('Title and genre are required.');
        console.log(req.body);
    } 
});

app.get ('/genres', function(req, res) {
    Genre.getGenres(function(err, genres){
       if (err){
           throw err;
       } 
        
        res.render('genres/index', {
            title: 'DevX Lab Books in Express and JsonDB', 
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius pariatur veritatis fugit vero deserunt omnis quas, voluptas maxime, non commodi, asperiores quis cum autem rerum. Excepturi provident aliquid, praesentium dolore.',
            page_title: 'Genres Listing',
            page_desc: '', 
            genres: genres
        });
        
    }, {name: 1}, 0); 
});

app.get ('/genres/:_id', function(req, res){
    Genre.getGenreById(req.params._id, function(err, genre){
       if (err){
           throw err;
       } 
        console.log(genre);
        
        res.render('genres/details', {
            title: 'DevX Lab Books in Express and JsonDB', 
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius pariatur veritatis fugit vero deserunt omnis quas, voluptas maxime, non commodi, asperiores quis cum autem rerum. Excepturi provident aliquid, praesentium dolore.',
            page_title: 'Genre Details',
            page_desc: '', 
            genre: genre
        });
    });
});

app.get ('/genre/del/:_id', function(req, res){
    Genre.delGenre(req.params._id, function(err, genre){
       if (err){
           throw err;
       } 
        
        //res.json(genre);
        res.send('Genre id: '+req.params._id+' deleted! <br/><a href="/genres">Go to Genres List</a>.');
        
        console.log('Genre id: '+req.params._id+' deleted!');
    });
});

app.get('/genre/add', function(req, res, next){
    
    res.render('genres/add', {
        title: 'DevX Lab Books in Express and JsonDB', 
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius pariatur veritatis fugit vero deserunt omnis quas, voluptas maxime, non commodi, asperiores quis cum autem rerum. Excepturi provident aliquid, praesentium dolore.',
        page_title: 'Add a Genre',
        page_desc: ''
    });
    
});

app.post('/genre/add', function(req, res, next){
        
    if (req.body.name) {
        var genre = req.body;
        
        Genre.addGenre(genre, function(err, genre){
           if (err){
               return next(genre);
           } 
            //res.json(genre);
            console.log('Genre added!');
        });
        
        Genre.getGenres(function(err, genres){
           if (err){
               throw err;
           } 

            res.json(genres, {
                title: 'DevX Lab Books in Express and JsonDB', 
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius pariatur veritatis fugit vero deserunt omnis quas, voluptas maxime, non commodi, asperiores quis cum autem rerum. Excepturi provident aliquid, praesentium dolore.',
                page_title: 'Genres Listing',
                page_desc: '', 
                genres: genres
            }, {name: 1}, 0);
            
        });
        
    } else {
        res.send('The genre is required.');
        console.log(req.body);
    } 
});

/**
** Export to JSON 
**/
app.get ('/api', function(req, res){
        
    res.render('api/index', {
        title: 'DevX Lab Books in Express and JsonDB', 
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius pariatur veritatis fugit vero deserunt omnis quas, voluptas maxime, non commodi, asperiores quis cum autem rerum. Excepturi provident aliquid, praesentium dolore.',
        page_title: 'API Homepage',
        page_desc: ''
    });
    
});

app.get ('/api/genres', function(req, res){
    var sort = {name: 1};
    
    Genre.getGenres(function(err, genres){
        if (err){
           throw err;
        } 

        res.json(genres);

        console.log(sort);
        
    }, sort, 0);
    
});

app.get ('/api/books', function(req, res){
    Book.getBooks(function(err, books){
       if (err){
           throw err;
       } 
        
       res.json(books);
    }, {create_date: -1}, 0);
});

app.get ('/api/genre/:_id', function(req, res){
    Genre.getGenreById(req.params._id, function(err, genre){
       if (err){
           throw err;
       } 
        
        res.json(genre);
    });
});

app.get ('/api/book/:_id', function(req, res){
    Book.getBookById(req.params._id, function(err, book){
       if (err){
           throw err;
       } 
        
        res.json(book);
    });
});

app.use (function(req, res) {
    //res.status(404).render('404');
    res.status(404).send('404 Error Page Not Found!');
});

/**
** Listen to port 
**/
//Get the environment variables we need.
var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];
var port   = config.server.port;
    app.listen(config.server.port);

    console.log('Running on port '+port+'...');

