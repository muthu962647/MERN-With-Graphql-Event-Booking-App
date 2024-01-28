const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const { schema } = require('./SchemaAndResolvers/schema');
const { rootValue } = require('./SchemaAndResolvers/Resolvers');

const app = express();
const events = [];

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: rootValue,
    graphiql: true
})); 

app.get('/', (req, res) => {
    res.send("Hello World");
});

mongoose.connect(`mongodb+srv://muthukumarb9626:${process.env.MONGO_PASSWORD}@cluster0.suct4zq.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(() => {
        console.log("Everything is going good");
        app.listen(3000, () => {
            console.log('Server is running on http://localhost:3000/graphql');
        });
    })
    .catch(err => {
        console.log(err);
    })


