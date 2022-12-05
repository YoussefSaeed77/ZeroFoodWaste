import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

const LoggedOutHome = () => {
    const [recipes, setRecipes] = useState(null);
    const [page, setPage] = useState('1');
    const [vegetarian, setVegetarian] = useState(false);
    const [vegan, setVegan] = useState(false);
    const [glutenFree, setGlutenFree] = useState(false);
    const handlePageNav = (e) => {
        setPage(e)
        window.scrollTo(0, 0)
    }
    const navigate = useNavigate();

        useEffect(() => {
        fetch(`/random-recipes`)
        .then((res) => res.json()) 
        .then((data) => {
            setRecipes(data.data.recipes);
        })}, [])

    const handleRecipeClick = (recipe) => {
            navigate(`/recipe/${recipe.id}`)
    }

    let recipesFiltered = []

    if (recipes) {
    recipesFiltered = recipes.filter((recipe) => {
        if (recipes) {
        if (glutenFree && vegan && vegetarian) {
            return (recipe.vegan === true && recipe.glutenFree === true && recipe.vegetarian === true)
        }
        else if (vegetarian && vegan) {
            return (recipe.vegetarian === true && recipe.vegan === true)
        }
        else if (vegetarian && glutenFree) {
            return (recipe.vegetarian === true && recipe.glutenFree === true)
        }
        else if (glutenFree && vegan) {
            return (recipe.vegan === true && recipe.glutenFree === true)
        }
        else if (vegetarian) {
            return recipe.vegetarian === true
        }
        else if (vegan) {
            return recipe.vegan === true
        }
        else if (glutenFree) {
            return recipe.glutenFree === true
        }
        else {
            return recipe
        }
    }
    })
}

    let pageNumbers;
    if (recipes) {
        pageNumbers = recipesFiltered.length/10;
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

    return (
        <Wrapper>
            <SearchBar/>
            <DietDiv1>
            <DietDiv2>
                    <Label htmlFor="vegetarian">Vegetarian</Label>
                    <InputDiet required id="vegetarian"  type="checkbox" 
                    onChange={(e) => {setVegetarian(!vegetarian); setPage('1')}}
                    value={vegetarian}></InputDiet>
                </DietDiv2>
                <DietDiv2>
                    <Label htmlFor="vegan">Vegan</Label>
                    <InputDiet required id="vegan"
                    onChange={(e) => {setVegan(!vegan); setPage('1')}}
                    value={vegan}
                    type="checkbox" ></InputDiet>
                </DietDiv2>
                <DietDiv2>
                    <Label htmlFor="glutenFree">Gluten-free</Label>
                    <InputDiet required id="glutenFree"  type="checkbox" 
                    onChange={(e) => {setGlutenFree(!glutenFree); setPage('1')}}
                    value={glutenFree}></InputDiet>
                </DietDiv2>
                </DietDiv1>
        {
            !recipes ?
            <Loading alt="loading" src="/ezgif.com-gif-maker3.gif"/>
            :
            <RecipesDiv>
                {
                    recipes.filter((recipe) => {
                        if (glutenFree && vegan && vegetarian) {
                            return (recipe.vegan === true && recipe.glutenFree === true && recipe.vegetarian === true)
                        }
                        else if (vegetarian && vegan) {
                            return (recipe.vegetarian === true && recipe.vegan === true)
                        }
                        else if (vegetarian && glutenFree) {
                            return (recipe.vegetarian === true && recipe.glutenFree === true)
                        }
                        else if (glutenFree && vegan) {
                            return (recipe.vegan === true && recipe.glutenFree === true)
                        }
                        else if (vegetarian) {
                            return recipe.vegetarian === true
                        }
                        else if (vegan) {
                            return recipe.vegan === true
                        }
                        else if (glutenFree) {
                            return recipe.glutenFree === true
                        }
                        else {
                            return recipe
                        }
                    }).slice(+(page-1)*10, +page*10).map((recipe) => {
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
        } 
        </Wrapper>
    )
}

const DietDiv1 = styled.div`
    display: flex;
    gap: 20px;
`

const Label = styled.label`
    color: #4a4a4a;
    font-weight: bolder;
    font-family: Garamond;
    letter-spacing: 1px;
`
const DietDiv2 = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

const InputDiet = styled.input``

const NoImage = styled.div`
    width: 350px;
    height: 100%;
    border-radius: 20px;
    border-width: 5px;
    font-weight: bolder;
    font-style: italic;
`

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
    top: 30vh;
`

const SideDiv =styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    gap: 20px;
    width: 100%;
`

const RecipeImage= styled.img`
    border-radius: 40px;
    height: 200px;
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


const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-inline: 20px;
`


export default LoggedOutHome;