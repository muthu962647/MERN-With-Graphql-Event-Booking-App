const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const cors = require("cors")

const { schema } = require('./graphql/schema/index');
const { rootValue } = require('./graphql/resolvers/index');

const isAuth = require('./middleware/is-auth');


const app = express();
const events = [];

app.use(bodyParser.json());

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
});

// app.use(cors);

app.use(isAuth);

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
    
app.listen(8000, () => {
    console.log('Server is running on http://localhost:8000/graphql');
});
    })
    .catch(err => {
        console.log(err);
    })


