var mongoose = require('mongoose');

/**
** Genres Schema 
**/
var GenreSchema = new mongoose.Schema({
   name: {
       type: String,
       required: true
   },
    create_date: {
        type: Date,
        default: Date.now
    }
});

//GenreSchema.path('name').required(true, 'grrr :( ');

var Genre = module.exports = mongoose.model('Genre', GenreSchema);

/**
** Get Genres 
**/
module.exports.getGenres = function(callback, sort, limit){
    Genre.find(callback).sort(sort).limit(limit);
}

/**
** Genres By Id
**/
module.exports.getGenreById = function(id, callback){
    Genre.findById(id, callback);
}

/**
** Add Genre 
**/
module.exports.addGenre = function(genre, callback){
    Genre.create(genre, callback);
}

/**
** Delete Genre 
**/
module.exports.delGenre = function(id, callback){
    Genre.deleteOne({ _id: id }, callback);
}