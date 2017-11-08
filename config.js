var config = {
    development: {
        //url to be used in link generation
        url: 'http://localhost',
        //mongodb connection settings
        database: {
            host:   'mongodb://localhost',
            port:   '27017',
            db:     '/bookstore'
        },
        //server details
        server: {
            host: 'localhost',
            port: '3000'
        }
    },
    production: {
        //url to be used in link generation
        url: 'http://devx-express-books.heroku.com',
        //mongodb connection settings
        database: {
            host: '127.0.0.1',
            port: '27017',
            db:   'mongodb://localhost'
        },
        //server details
        server: {
            host:   'localhost',
            port:   '3000'
        }
    }
};
module.exports = config;