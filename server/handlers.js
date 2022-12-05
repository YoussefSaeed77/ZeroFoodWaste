'use strict';
const { uuid } = require('uuidv4');
const { MongoClient } = require("mongodb");

require("dotenv").config();

const request = require('request-promise');
const e = require('express');

const { MONGO_URI, API_KEY } = process.env;


const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

const addUser = async (req, res) => {
    const {email, family_name, given_name, name, nickname, picture} = req.body;
    const userDetails = {
        _id: email,
        family_name: family_name,
        given_name: given_name,
        name: name,
        nickname: nickname,
        picture: picture,
        favouriteList: [],
        viewed: [],
        creations: []
    }
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("Zero_Food_Waste");
        const users = await db.collection("Users").find().toArray();
        const userIds = [];
        users.forEach((user) => {
            userIds.push(user._id)
        })
        if (userIds.includes(email)) {
            res.status(400).json({status: 400, error: "That user is already in the database!"})
        } 
        else {
        await db.collection("Users").insertOne(userDetails)
        res.status(200).json({status: 200, message: "User successfully added", data: userDetails})
        }
        client.close();
    }
    catch(err) {
        console.log(err.stack)
    }
}

const getUser = async (req, res) => {
    const {_id} = req.params; 
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("Zero_Food_Waste");
        const user = await db.collection("Users").findOne({_id: _id})
        res.status(200).json({status: 200, data: user})
        client.close();
    }
    catch(err) {
        console.log(err.stack)
    }
}

const addToFavourites = async (req, res) => {
    const {userId, recipeId, recipeName, recipeImage} = req.body;
    const recipeFavourited = {
        id: recipeId,
        name: recipeName,
        image: recipeImage
    }
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("Zero_Food_Waste");
        const user = await db.collection("Users").findOne({_id: userId});
        const favouriteList = user.favouriteList;
        let recipeIds = [];
        favouriteList.forEach((recipe) => {
            recipeIds.push(recipe.id)
        })
        if (recipeIds.includes(recipeId)) {
            res.status(400).json({status: 400, error: `That recipe is already in the favourites of ${userId}!`})
        }
        else {
        await db.collection("Users").updateOne({_id: userId}, {
            $push: {
                favouriteList: recipeFavourited
            }
        })
        res.status(200).json({status: 200, message: "Recipe successfully added to favourites!", data: recipeId})
        }
        client.close();
    }
    catch(err) {
        console.log(err.stack)
    }
}

const addToViewed = async (req, res) => {
    const {userId, recipeId, recipeName, recipeImage} = req.body;
    const recipeViewed = {
        id: recipeId,
        name: recipeName,
        image: recipeImage
    }
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("Zero_Food_Waste");
        const user = await db.collection("Users").findOne({_id: userId});
        const viewed = user.viewed;
        let recipeIds = [];
        viewed.forEach((recipe) => {
            recipeIds.push(recipe.id)
        })
        if (recipeIds.includes(recipeId)) {
            res.status(400).json({status: 400, error: `That recipe is already in the viewed of ${userId}!`})
        }
        else {
        await db.collection("Users").updateOne({_id: userId}, {
            $push: {
                viewed: recipeViewed
            }
        })
        res.status(200).json({status: 200, message: "Recipe successfully added to viewed!", data: recipeId})
        }
        client.close();
    }
    catch(err) {
        console.log(err.stack)
    }
}

const removeFromFavourites = async (req, res) => {
    const {userId, recipeId, recipeName, recipeImage} = req.body;
    const recipeFavourited = {
        id: recipeId,
        name: recipeName,
        image: recipeImage
    }
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("Zero_Food_Waste");
        const user = await db.collection("Users").findOne({_id: userId});
        const favouriteList = user.favouriteList;
        let recipeIds = [];
        favouriteList.forEach((recipe) => {
            recipeIds.push(recipe.id)
        })
        if (!recipeIds.includes(recipeId)) {
            res.status(404).json({status: 404, error: `That recipe does not exist in the favourites of ${userId}`})
        }
        else {
        await db.collection("Users").updateOne({_id: userId}, {
            $pull: {
                favouriteList: recipeFavourited
            }
        })
        res.status(200).json({status: 200, message: "Recipe successfully removed from favourites!", data: recipeId})
        }
        client.close();
    }
    catch(err) {
        console.log(err.stack)
    }
}

const addRecipe = async (req, res) => {
    req.body._id = uuid();
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("Zero_Food_Waste");
        await db.collection("Users").updateOne({_id: req.body.userId}, {
            $push: {
                creations: req.body
            }
        })
        res.status(200).json({status: 200, message: "Recipe successfully added to creations!", data: req.body})
        client.close();
    }
    catch(err) {
        console.log(err.stack)
    }
}

const getUserRecipe =  async (req, res) => {
    const {id} = req.params;
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("Zero_Food_Waste");
        const user = await db.collection("Users").find({creations: {$elemMatch: {_id: id}}}).toArray();
        const recipe = user.map((element) => {
            return element.creations.find(item => item._id === id)
        })
        res.status(200).json({status: 200, message: "Recipe successfully found!", data: recipe[0]})
        client.close();
    }
    catch(err) {
        console.log(err.stack)
    }
}

const updateRecipe = async (req, res) => {
    const {_id} = req.body;
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("Zero_Food_Waste");
        await db.collection("Users").updateOne({_id: req.body.userId}, {
            $pull: {
                creations: {_id: _id}
            }
        })
        await db.collection("Users").updateOne({_id: req.body.userId}, {
            $push: {
                creations: req.body
            }
        })
        res.status(200).json({status: 200, message: "Recipe successfully updated", data: req.body})
        client.close();
    }
    catch(err) {
        console.log(err.stack)
    }
}

const deleteRecipe = async (req, res) => {
    const {_id} = req.body;
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("Zero_Food_Waste");
        const user = await db.collection("Users").find({creations: {$elemMatch: {_id: _id}}}).toArray();
        await db.collection("Users").updateOne({_id: user[0]._id}, {
            $pull: {
                creations: {_id: _id}
            }
        })
        res.status(200).json({status: 200, message: "Recipe successfully deleted", data: _id})
        client.close();
    }
    catch(err) {
        console.log(err.stack)
    }
}

const getRecipeById = async (req, res) => {
    const {id} = req.params;
    id.toString()
    try {
        return request(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`) 
        .then((response) => JSON.parse(response))
        .then((parsedResponse) => {
            res.status(200).json({status: 200, data: parsedResponse})
        })
        .catch((err) => {
            return err.error ? JSON.parse(err.error) : err;
        });
    }
    catch(err) {
        console.log(err.stack)
    }
}



const generateRandomRecipes = async (req, res) => {
    return request(`https://api.spoonacular.com/recipes/random?number=100&apiKey=${API_KEY}`) 
    .then((response) => JSON.parse(response))
    .then((parsedResponse) => {
        res.status(200).json({status: 200, data: parsedResponse})
    })
    .catch((err) => {
        return err.error ? JSON.parse(err.error) : err;
    });
}

const getSimilarRecipes = async (req, res) => {
    const {id} = req.params;
    id.toString()
    try {
        return request(`https://api.spoonacular.com/recipes/${id}/similar?number=3&apiKey=${API_KEY}`) 
        .then((response) => JSON.parse(response))
        .then((parsedResponse) => {
            res.status(200).json({status: 200, data: parsedResponse})
        })
        .catch((err) => {
            return err.error ? JSON.parse(err.error) : err;
        });
    }
    catch(err) {
        console.log(err.stack)
    }
}

const getRecipeByIngredients = async (req, res) => {
    try {
        return request(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${req.query.ingredients}&number=45&ranking=1&apiKey=${API_KEY}`) 
        .then((response) => JSON.parse(response))
        .then((parsedResponse) => {
            res.status(200).json({status: 200, data: parsedResponse})
        })
        .catch((err) => {
            return err.error ? JSON.parse(err.error) : err;
        });
    }
    catch(err) {
        console.log(err.stack)
    }
}

const addComment = async (req, res) => {
    const {recipeId, userId, userPicture, comment, time, rating} = req.body;
    const client = new MongoClient(MONGO_URI, options);
    const commentRecipe = {
        userId: userId,
        userPicture: userPicture,
        comment: comment,
        time: time,
        rating: rating
    }
    try {
        await client.connect();
        const db = client.db("Zero_Food_Waste");
        await db.collection("Comments").updateOne({_id: recipeId}, {
            $push: {
                comments: commentRecipe
            }
        })
        res.status(200).json({status: 200, message:"Comment successfully added!", comment: commentRecipe.comment})
        client.close();
    }
    catch(err) {
        console.log(err.stack)
    }
}

const getRecipeComments = async (req, res) => {
    const {id} = req.params;
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("Zero_Food_Waste");
        const allComments = await db.collection("Comments").find().toArray();
        const allIds = []
        allComments.forEach((item) => {
            allIds.push(item._id)
        })
        if (!allIds.includes(id)) {
            const recipe = {
                _id: id,
                comments: []
            }
            await db.collection("Comments").insertOne(recipe)
            const comments = await db.collection("Comments").findOne({_id: id})
            res.status(200).json({status: 200, message: "Comment successfully inserted and fetched!", data: comments})
        }
        else {
            const comments = await db.collection("Comments").findOne({_id: id})
            res.status(200).json({status: 200, message: "Comments successfully fetched!", data: comments})
            }
        client.close();
    }
    catch(err) {
        console.log(err.stack)
    }
}

const searchRecipes = async (req, res) => {
    const {input} = req.params;
    try {
        return request(`https://api.spoonacular.com/recipes/autocomplete?number=10&query=${input}&apiKey=${API_KEY}`) 
        .then((response) => JSON.parse(response))
        .then((parsedResponse) => {
            res.status(200).json({status: 200, data: parsedResponse})
        })
        .catch((err) => {
            return err.error ? JSON.parse(err.error) : err;
        });
    }
    catch(err) {
        console.log(err.stack)
    }
}



module.exports = {
    addUser, 
    generateRandomRecipes, 
    getRecipeByIngredients, 
    getRecipeById, 
    addToFavourites, 
    removeFromFavourites, 
    getUser,
    addComment,
    getRecipeComments,
    addRecipe,
    addToViewed,
    getUserRecipe,
    updateRecipe, 
    deleteRecipe,
    getSimilarRecipes,
    searchRecipes
}