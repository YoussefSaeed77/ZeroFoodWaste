const express = require('express');
const helmet = require("helmet");
const morgan = require("morgan");
const { 
    generateRandomRecipes, 
    addUser, 
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
} = require('./handlers');
const port = 8000

express()

.use(express.json())
.use(helmet())
.use(morgan('tiny'))

.get('/hello', (req, res) => {
    res.status(200).json({status: 200, message:'Hello World!'})
    })

    .get('/random-recipes', generateRandomRecipes)
    .post('/add-user', addUser)
    .get('/get-user/:_id', getUser)
    .get('/recipe-by-ingredients', getRecipeByIngredients)
    .get('/recipe/:id', getRecipeById)
    .patch('/add-to-favourites', addToFavourites)
    .patch('/remove-from-favourites', removeFromFavourites)
    .post('/add-comment', addComment)
    .get('/get-recipe-comments/:id', getRecipeComments)
    .post('/add-recipe', addRecipe)
    .patch('/add-to-viewed', addToViewed)
    .get('/get-user-recipe/:id', getUserRecipe)
    .patch('/update-recipe', updateRecipe)
    .patch('/delete-user-recipe', deleteRecipe)
    .get('/get-similar-recipes/:id', getSimilarRecipes)
    .get('/search-recipes/:input', searchRecipes)
    .listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
