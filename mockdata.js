var casual = require('casual');

// Create an object for config file
var db = {books:[]};

for(var i=101; i<=115; i++){
    var book = {};
  book.id = i;

  // Create a random 1-6 word title
  book.title = casual.words(casual.integer(1,6));
  book.genre = casual.words(casual.integer(1,1));
  book.author = casual.first_name + ' ' + casual.last_name;
    
  // Create fake publisher
  book.publisher = casual.last_name + ' publishing';
    
  // Create random description
  book.description = casual.words(casual.integer(20,30));
  // Create random fake image
  book.img_url = 'http://amazon.com/books/img/'+casual.words(casual.integer(1,1))+'.jpg';
  // Create random fake url
  book.buy_url = 'http://amazon.com/books/'+casual.words(casual.integer(1,1))+'.html';
  // Create random date
  book.create_date = casual.integer(1,12)+'/'+casual.integer(1,31)+'/'+casual.integer(2015,2017);
  
  // Randomly rate the book between 0 and 5
  book.rating = Math.floor(Math.random()*100+1)/20;

  // Assign a publishing year between 1700 and 2016
    book.year_published = casual.integer(1700,2016);
    
    //create random pages
    book.pages = casual.integer(200,400);
    
    //Push to object
    db.books.push(book);
}
console.log(JSON.stringify(db));

/**
 * To create a Database.json file using this script, 
 * run the following command in your terminal:
 * node mockdata.js > Database.json
 */