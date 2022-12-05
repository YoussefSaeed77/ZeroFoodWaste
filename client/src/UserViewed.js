import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CurrentUserContext } from "./CurrentUserContext";
import LoadingImage from "./LoadingImage";

const UserViewed = () => {
    const navigate = useNavigate()
    const {currentUser} = useContext(CurrentUserContext)
    return (
        <Wrapper>
            {
                !currentUser ?
                <LoadingImage/>
                :
                <div>
                {
                    currentUser.viewed.length === 0 ?
                    <h2 style={{opacity: "60%", fontStyle: "italic"}}>You currently have no viewed recipes.</h2>
                    :
                <Recipes>
                    {
                        
                        currentUser.viewed.map((recipe) => {
                            return (
                            <Recipe key={recipe.id} onClick={() => {navigate(`/recipe/${recipe.id}`)}}>
                                <h2>{recipe.name}</h2>
                                {
                                recipe.image === undefined || recipe.image === null?
                                <NoImage>No image to display</NoImage>
                                :
                                <RecipeImage src={recipe.image} alt="recipe"></RecipeImage> 
                                }
                            </Recipe>)
                        })
                    }
                </Recipes>
                }
                </div>
            }
        </Wrapper>
    )
}

const NoImage = styled.div`
    width: 350px;
    height: 100%;
    border-radius: 20px;
    border-width: 5px;
    font-weight: bolder;
    font-style: italic;
`

const RecipeImage = styled.img`
    border-radius: 40px;
    max-width: 100%;
    height: 200px;
`

const Recipe = styled.div`
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

const Recipes = styled.div`
    margin-bottom: 40px;
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px;
    text-align: center;
`

export default UserViewed;