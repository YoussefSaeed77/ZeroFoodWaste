import { useState, useEffect } from "react";
import styled from "styled-components";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const RecipeByIngredients = () => {
    const [ingredients, setIngredients] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [recipes, setRecipes] = useState(null);
    const [showRecipes, setShowRecipes] = useState(false);
    const [page, setPage] = useState('1');
    const handlePageNav = (e) => {
        setPage(e)
        window.scrollTo(0, 0)
    }
    const ref = useRef(null);
    let pageNumbers;
    if (recipes) {
        pageNumbers = recipes.length/10;
    }
    const pageBar = [];
    if (recipes) {
        if (pageNumbers % 1 !== 0) {
            for (let i= 1; i <= pageNumbers+1; i++) {
                pageBar.push(i);
            }
        }
        else {
            for (let i= 1; i <= pageNumbers; i++) {
                pageBar.push(i);
            }
        }
    }
    const navigate = useNavigate();
    useEffect(() => {
        ref.current.focus();
    }, [])
    const handleChange = (e) => {
        setInputValue(e.target.value)
    }
    const handleClick = (e) => {
        if (!ingredients.includes(inputValue)) {
        e.preventDefault()
            setIngredients(current => [...current, inputValue])
            setInputValue('')
            ref.current.focus()
        }
    }

    const removeAll = () => {
        setIngredients([])
    }

    const handleSearch = () => {
        let searchString = `` 
        ingredients.forEach((ingredient) => {
            searchString = searchString + ingredient + ','
        })
        fetch(`/recipe-by-ingredients?ingredients=${searchString}`)
        .then((res) => res.json()) 
        .then((data) => {
            setRecipes(data.data);
        })
        setShowRecipes(true)
        removeAll()
    }
    const removeIngredient = (item) => {
        setIngredients(current => current.filter((ingredient) => {
            return ingredient !== item
        }))
    }
    const handleRecipeClick = (recipe) => {
            navigate(`/recipe/${recipe.id}`)
        
    }

    return (
        <Wrapper>
            <h1>What's in your fridge?</h1>
            <InputDiv onSubmit={(e) => {handleClick(e)}}>
                <Input value={inputValue} onChange={handleChange} placeholder="Type in an ingredient" ref={ref} required></Input>
                <AddButton type="submit">Add Ingredient</AddButton>
            </InputDiv>
            {
                !ingredients.length > 0?
                <p></p>
                :
                <IngredientsDiv>
                    {
                        ingredients.map((ingredient) => {
                            return (
                                <IndividualIngredient key={ingredient}>
                                <p>{ingredient}</p>
                                <RemoveIngredient onClick={() => {removeIngredient(ingredient)}}>X</RemoveIngredient>
                                </IndividualIngredient>
                            )
                        })
                    }
                </IngredientsDiv>
            }
            {
                !ingredients.length > 0 ?
                <p></p>
                :
                <ButtonsDiv>
                    <RemoveAll onClick={() => {removeAll()}}>Remove All</RemoveAll>
                    <SearchRecipes onClick={() => {handleSearch()}}>Search Recipes</SearchRecipes>
                </ButtonsDiv>
            }
            {!showRecipes ? 
            <p></p>
        : 
        <>
        {
            !recipes ?
            <Loading alt="loading" src="/ezgif.com-gif-maker3.gif"/>
            :
            <RecipesDiv>
                {
                    !recipes.length > 0 ?
                    <h2 style={{opacity: "60%", fontStyle: "italic"}}>Sorry but no results were found!</h2>
                    :
                    recipes.slice(+(page-1)*10, +page*10).map((recipe) => {
                        return (
                            <RecipeDiv onClick={() => {handleRecipeClick(recipe)}}>
                                <h2>{recipe.title}</h2>
                                <SideDiv>
                                {
                                recipe.image === undefined?
                                <NoImage>No image to display</NoImage>
                                :
                                <RecipeImage src={recipe.image} alt="recipe"></RecipeImage> 
                                }
                                <Details>
                                    <p>Unused ingredients: 
                                    {
                                        recipe.unusedIngredients.length === 0 ?
                                        <Detail> none.</Detail>
                                        :
                                        recipe.unusedIngredients.map((ingredient, index) => {
                                            return (
                                                index !== recipe.unusedIngredients.length -1?
                                                <Detail>{ingredient.name}, </Detail>
                                                :
                                                <Detail>{ingredient.name}.</Detail>
                                            )
                                        })
                                    }
                                    </p>
                                    <p>Extra ingredients needed: {
                                        recipe.missedIngredients.length === 0 ?
                                        <Detail> none.</Detail>
                                        :
                                        recipe.missedIngredients.map((ingredient, index) => {
                                            return (
                                                index !== recipe.missedIngredients.length -1?
                                                <Detail>{ingredient.name}, </Detail>
                                                :
                                                <Detail>{ingredient.name}.</Detail>
                                            )
                                        })
                                    }</p>
                                </Details>
                                </SideDiv>
                            </RecipeDiv>
                        )
                    })
                }
                    <PaginationBar>
                            {
                                pageBar.map((number) => {
                                return (
                                <PageNumber 
                                className={`${page === `${number}`? "selected": ""}`}
                                onClick={(e) => handlePageNav(e.target.innerText)}>
                                    {number}
                                </PageNumber>
                            )
                            })
                            }
                    </PaginationBar>
            </RecipesDiv>
        } </>}
        </Wrapper>
    )
}

const PageNumber = styled.div`
    font-weight: bold;
    font-family: Garamond;
    color: #4a4a4a;
    &:hover {
        color: #3ebeb2;
        cursor: pointer;
        border-bottom: solid;
        border-color: #3ebeb2;
    }
`

const NoImage = styled.div`
    width: 350px;
    height: 100%;
    border-radius: 20px;
    border-width: 5px;
    font-weight: bolder;
    font-style: italic;
`

const PaginationBar = styled.div`
    margin-top: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    .selected {
        border-bottom: solid;
        color: #3ebeb2;
        border-color: #3ebeb2;
    }
`

const Loading = styled.img`
    width: 100px;
    position: relative;
    box-shadow: none;
`

const SideDiv =styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    gap: 20px;
    width: 100%;
`

const RecipeImage = styled.img`
    border-radius: 40px;
    height: 200px;
`

const Details = styled.div``

const Detail = styled.span`
    font-weight: bold;
    font-style: italic;
`

const InputDiv = styled.form`
    display: flex;
    align-items: center;
`

const ButtonsDiv = styled.div``

const RemoveAll = styled.button`
    margin: 10px;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    border: none;
    padding: 20px;
    border-radius: 30px;
    font-family: Garamond;
    color: #4a4a4a;
    font-weight: bolder;
    letter-spacing: 1px;
    background-color: #3ebeb2;
    &:hover {
        cursor: pointer;
        color: white;
    }
    &:active {
        transition: all 0.5s ease;
        transform: scale(0.9)
    }
`

const RecipeDiv = styled.div`
    padding: 20px;
    border-radius: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 70vw;
    margin-top: 20px;
    text-align: center;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    &:hover{
        cursor: pointer;
        transform: scale(1.05);
        transition: all 0.5s ease;
    }
`

const RecipesDiv = styled.div`
    margin-bottom: 30px;
`

const SearchRecipes = styled.button`
    margin: 10px;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    border: none;
    padding: 20px;
    border-radius: 30px;
    font-family: Garamond;
    color: #4a4a4a;
    font-weight: bolder;
    letter-spacing: 1px;
    background-color: #3ebeb2;
    &:hover {
        cursor: pointer;
        color: white;
    }
    &:active {
        transition: all 0.5s ease;
        transform: scale(0.9)
    }
`

const RemoveIngredient = styled.button`
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    border: none;
    border-radius: 50%;
    font-family: Garamond;
    height: 25px;
    color: #4a4a4a;
    font-weight: bolder;
    letter-spacing: 1px;
    background-color: #3ebeb2;
    &:hover {
        cursor: pointer;
        color: white;
    }
    &:active {
        transition: all 0.5s ease;
        transform: scale(0.9)
    }
`

const IndividualIngredient = styled.div`
    margin-top: 10px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    background-color: #4a4a4a;
    color: white;
    display: flex;
    gap: 5px;
    align-items: center;
    max-width: 150px;
    padding: 5px;
    border-radius: 20px;
`

const IngredientsDiv = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 5px;
`

const AddButton = styled.button`
    margin: 10px;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    border: none;
    padding: 20px;
    border-radius: 30px;
    font-family: Garamond;
    color: #4a4a4a;
    font-weight: bolder;
    letter-spacing: 1px;
    background-color: #3ebeb2;
    &:hover {
        cursor: pointer;
        color: white;
    }
    &:active {
        transition: all 0.5s ease;
        transform: scale(0.9)
    }
`
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-inline: 20px;
`
const Input = styled.input`
    border-radius: 30px;
    width: 200px;
    height: 50px;
    padding-inline: 20px;
    border-color: #4a4a4a;
    &:focus {
        border-color: #4a4a4a;
    }
`

export default RecipeByIngredients;