import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CurrentUserContext } from "./CurrentUserContext";
import LoadingImage from "./LoadingImage";
import SearchBar from "./SearchBar";

const RecommendedRecipes = () => {
    const {currentUser} = useContext(CurrentUserContext);
    const [recipes, setRecipes] = useState(null);
    const [page, setPage] = useState('1');
    const handlePageNav = (e) => {
        setPage(e)
        window.scrollTo(0, 0)
    }
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

    const handleRecipeClick = (recipe) => {
        navigate(`/recipe/${recipe}`)
    
}

let recommendedRecipes = [];

    useEffect(() => {
        currentUser.favouriteList.forEach( async (item) => {
            await  fetch(`/get-similar-recipes/${item.id}`)
            .then((res) => res.json()) 
            .then((data) => {
                data.data.forEach((recipe) => {
                    recommendedRecipes.push({data: recipe, shownDueTo: item.name})
                    setRecipes([... new Set(recommendedRecipes)])
                })
            })
        })
    },
    [currentUser]) 
    

    return (
        <Wrapper>
            <SearchBar/>
            {
                !recipes ?
                <Loading alt="loading" src="/ezgif.com-gif-maker3.gif"/>
                :
                <RecipesDiv>
                    {
                        recipes.slice(+(page-1)*10, +page*10).map((recipe) => {
                            return (
                                <RecipeDiv onClick={()=> {handleRecipeClick(recipe.data.id)}} key={recipe.data.id}>
                                <h2>{recipe.data.title}</h2>
                                <p>Recommended because you favourited <Detail>{recipe.shownDueTo}</Detail>.</p>
                                </RecipeDiv>
                            )
                        })
                    }
                </RecipesDiv>
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
        </Wrapper>
    )
}

const Detail = styled.span`
    font-weight: bold;
    font-style: italic;
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 30px;
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


export default RecommendedRecipes;