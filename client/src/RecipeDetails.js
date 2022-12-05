import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import moment from 'moment';
import { CurrentUserContext } from "./CurrentUserContext";
import {BsSuitHeart, BsSuitHeartFill} from "react-icons/bs";
import { useAuth0 } from "@auth0/auth0-react";
import {AiFillStar, AiOutlineStar} from "react-icons/ai"

const RecipeDetails = () => {
    const {isAuthenticated} = useAuth0();
    const {currentUser, setUpdated} = useContext(CurrentUserContext);
    const {id} = useParams();
    const [recipe, setRecipe] = useState(null);
    const [recipeIsFavourited, setRecipeIsFavourited] = useState(null);
    const [input, setInput] = useState('');
    const [comments, setComments] = useState(null);
    const [rating, setRating] = useState(null);
    const [page, setPage] = useState('1');
    const handlePageNav = (e) => {
        setPage(e)
    }
    let pageNumbers;
    if (comments) {
        pageNumbers = comments.length/2;
    }
    const pageBar = [];
    if (comments) {
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
    useEffect(() => {if (recipe && currentUser) {
        if (isAuthenticated) {
            fetch(`/add-to-viewed`, {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({userId: currentUser._id, recipeId: recipe.id, recipeName: recipe.title, recipeImage: recipe.image})
            })
            .then(res => res.json())
            .then((data) => {
            })}
    }}, [currentUser, recipe])
    useEffect(()=> {
        if (currentUser) {
            let favouriteIds = [];
            currentUser.favouriteList.forEach((object) => {
                favouriteIds.push(object.id)
            })
            setRecipeIsFavourited(favouriteIds.includes(id))
        }
    }, [currentUser])
    useEffect(() => {
        fetch(`/recipe/${id}`)
        .then((res) => res.json())
        .then((data) => {
            setRecipe(data.data)
        })
    },[])
    const handleFavourite = () => {
            fetch(`/add-to-favourites`, {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({userId: currentUser._id, recipeId: id, recipeName: recipe.title, recipeImage: recipe.image})
            })
            .then(res => res.json())
            .then((data) => {
            })
            setRecipeIsFavourited(!recipeIsFavourited)
            setUpdated(true);
            window.location.reload()
    }
    const handleRemoveFavourite = () => {
        fetch(`/remove-from-favourites`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({userId: currentUser._id, recipeId: id, recipeName: recipe.title, recipeImage: recipe.image})
        })
        .then(res => res.json())
        .then((data) => {
        })
        setRecipeIsFavourited(!recipeIsFavourited)
        setUpdated(true);
        window.location.reload()
    }

    useEffect(()=> {
        fetch(`/get-recipe-comments/${id}`)
        .then((res) => res.json())
        .then((data) => {
            setComments(data.data.comments)
        })
    }, [currentUser])

    const handleChange = (value) => {
        setInput(value)
    }

    const submitComment = (e) => {
        e.preventDefault();
        if (currentUser) {
            fetch("/add-comment", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipeId: id,
                    userId: currentUser._id,
                    userPicture: currentUser.picture,
                    comment: input,
                    time: moment().format('lll'),
                    rating: rating
                })
            })
            .then(res => res.json())
            .then((data) => {
                window.location.reload();
            })
        }
    }
    const starsArray = [1, 2, 3, 4, 5]
    const handleRate = (value) => {
        setRating(value)
    }
    const removeRating = () => {
        setRating(null);
    }
    const navigate = useNavigate();
    return (
        <Wrapper>
            {
                !recipe?
                <Loading alt="loading" src="/ezgif.com-gif-maker3.gif" style={{position: "relative", left:"43vw"}}/>
                :
                <RecipeInfo>
                    <RecipeName>{recipe.title}</RecipeName>
                    <Div1>
                        <Div2>
                            {
                                recipe.image === undefined?
                                <NoImage>No image to display</NoImage>
                                :
                                <RecipeImage src={recipe.image} alt="recipe"></RecipeImage> 
                            }
                            <DietDiv>
                                {
                                    recipe.vegan ?
                                    <Detail>Vegan</Detail>
                                    :
                                    <Detail>Not vegan</Detail>
                                }
                                {
                                    recipe.vegetarian ?
                                    <Detail>Vegetarian</Detail>
                                    :
                                    <Detail>Non-vegetarian</Detail>
                                }
                                {
                                    recipe.glutenFree ?
                                    <Detail>Gluten-free</Detail>
                                    :
                                    <Detail>Includes gluten</Detail>
                                }
                            </DietDiv>
                            <p>Number of servings: <Detail>{recipe.servings}</Detail></p>
                            <p style={{marginTop: "-15px"}}>Total cooking time: <Detail>{recipe.readyInMinutes}</Detail></p>
                            <LikeDiv>
                            {
                                isAuthenticated ? 
                                <Like>
                                    {
                                        recipeIsFavourited ?
                                        <BsSuitHeartFill 
                                        style={{color: "red"}}
                                        onClick={()=>{handleRemoveFavourite()}} className="icon"/>
                                        :
                                        <BsSuitHeart 
                                        style={{color: "#4a4a4a"}}
                                        onClick={()=>{handleFavourite()}} className="icon"/>
                                    }
                                </Like>
                                :
                                <p></p>
                            }
                    </LikeDiv>
                        </Div2>
                        <RecipeSummary dangerouslySetInnerHTML={{__html: recipe.summary}}
                        style={{color: "#4a4a4a", fontFamily: 'Garamond'}}></RecipeSummary>
                    </Div1>
                    <Ingredients>
                        <h2>Ingredients:</h2>
                        <IngredList>
                            {
                                recipe.extendedIngredients.map((ingredient) => {
                                    return (
                                        <li key={ingredient.id}>{ingredient.original}</li>
                                    )
                                })
                            }
                        </IngredList>
                    </Ingredients>
                    <h2>Instructions:</h2>
                    <Instructions>
                        {
                            recipe.analyzedInstructions[0].steps.map((step) => {
                                return(<Line>
                                    <p>Equipment required: 
                                        {step.equipment.length === 0 ?
                                        <Detail> none.</Detail>
                                        :
                                        <>
                                    {step.equipment.map((equipment, index) => {
                                        return (
                                            index !== step.equipment.length -1?
                                            <Detail> {equipment.name}, </Detail>
                                            :
                                            <Detail> {equipment.name}.</Detail>
                                        )
                                    })}
                                    </>
                                }
                                    </p>
                                    <p style={{marginTop: "-15px"}}> {step.step}</p>
                                </Line>)
                            })
                        }
                    </Instructions>
                </RecipeInfo>
            }
            {
                !isAuthenticated ?
                <h2 style={{opacity: "60%", fontStyle: "italic", textAlign: "center"}}>Only logged in users can leave a comment or rating.</h2>
                :
                <div>
                <Form onSubmit={(e)=>{submitComment(e)}}>
                    <InputDiv>
                    <Input required id="comment" onChange={(e) => {handleChange(e.target.value)}}
                    placeholder="Leave a comment"
                    ></Input>
                    </InputDiv>
                    <Button type="submit">Submit</Button>
                </Form>
                <StarsDiv>
                    <div style={{display: "flex"}}>
                        {
                            starsArray.map((star, index) => {

                                return (
                                    <div style={{display: "flex"}}>
                                        {
                                            index+1 <= rating || !rating === null ?
                                            <AiFillStar className="star" style={{color: "gold"}} key={star} onClick= {(e)=>handleRate(index+1)}/>
                                            :
                                            <AiOutlineStar className="star" key={star} onClick={(e) => handleRate(index+1)}/>
                                        }
                                    </div>
                                )
                            })
                        }
                        </div>
                        <RemoveRating onClick={()=>{removeRating()}}>X</RemoveRating>
                    </StarsDiv>
                </div>
            }
                    
            {
                !comments ?
                <Loading alt="loading" src="/ezgif.com-gif-maker3.gif" style={{position: "relative", left:"43vw", marginTop: '20px'}}/>
                :
                <CommentsDiv>
                    {
                        comments.length === 0 || !comments?
                        <h2 style={{opacity: "60%", fontStyle: "italic"}}>
                            {
                                !isAuthenticated ?
                                ""
                                :
                                "There are currently no comments. Be the first to leave a comment."
                            }</h2>
                        :
                        <Comments>
                            <h2>Comments:</h2>
                            {
                                comments.slice(+(page-1)*2, +page*2).map((comment) => {
                                    return (
                                        <Comment>
                                            <UserDiv>
                                            <UserImg alt="user" src={comment.userPicture}/>
                                            <p><UserName onClick={() => {navigate(`/profile/${comment.userId}`)}}>
                                                {comment.userId}
                                            </UserName> commented:</p>
                                            </UserDiv>
                                            <div style={{display: "flex", justifyContent: "flex-start", width: "100%"}}>
                                            <p>{comment.comment}</p>
                                            </div>
                                            <div style={{display: "flex", justifyContent: "flex-end", width: "100%"}}>
                                                <Detail >
                                                    {comment.time}
                                                </Detail>
                                            </div>
                                            {
                                                comment.rating === null ?
                                                <p></p>
                                                :
                                                <RatingDiv>
                                                    {
                                                        starsArray.map((star, index) => {

                                                            return (
                                                                <div>
                                                                    {
                                                                        index+1 <= comment.rating?
                                                                        <AiFillStar style={{color: "gold"}}/>
                                                                        :
                                                                        <AiOutlineStar/>
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </RatingDiv>
                                            }
                                        </Comment>
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
                        </Comments>
                    }
                </CommentsDiv>
            }
        </Wrapper>
    )
}

const UserName = styled.span`
    font-weight: bolder;
    font-style: italic;
    &:hover{
        cursor: pointer;
        color: #3ebeb2;
        text-decoration: underline;
    }
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

const RemoveRating = styled.button`
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    border: none;
    font-size: 15px;
    border-radius: 50%;
    height: 25px;
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

const RatingDiv = styled.div`
    display: flex;
`

const StarsDiv = styled.div`
margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    .star:hover {
        cursor: pointer;
        transition: all 0.5s ease;
        transform: scale(1.1)
    }
`

const UserImg = styled.img`
    width: 40px;
    border-radius: 50%;
`

const UserDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
`

const Button = styled.button`
    max-width: 170px;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    border: none;
    font-size: 15px;
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

const Loading = styled.img`
    width: 100px;
    position: relative;
    box-shadow: none;
`

const InputDiv = styled.div``

const Input = styled.textarea`
        margin-top: 20px;
        width: 600px;
        height: 200px;
        display: flex;
        resize: none;
        font-size: 20px;
        overflow: auto;
        outline: none;
        border-radius: 30px;
        padding: 20px;
        border-color: #4a4a4a;
        margin-bottom: 20px;
        &:focus {
        border-color: #4a4a4a;
    }
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;`

const Comment = styled.div`
    display: flex;
    flex-direction: column;
    border-bottom: solid;
    border-color: lightgray;
    padding-inline: 20px;
    margin-top: 10px;
    color:  #4a4a4a;
    align-items: center;
    max-width: 100%;
    padding: 5px;
    border-radius: 20px;
`

const Comments = styled.div`
    text-align: left;
`

const CommentsDiv = styled.div`
    text-align: center;
`

const NoImage = styled.div`
    width: 350px;
    height: 100%;
    border-radius: 20px;
    border-width: 5px;
    font-weight: bolder;
    font-style: italic;
`

const Like = styled.div``

const RecipeSummary = styled.p`
    width: 600px;
`

const LikeDiv = styled.div`
`

const Line = styled.li`
`

const Detail = styled.span`
    font-weight: bolder;
    font-style: italic;
`

const Instructions = styled.ol`
`

const Div2 = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Div1 = styled.div` 
    display: flex;
    justify-content: center;
    justify-content: space-evenly;
    width: 100%;
    text-align: center;
    gap: 20px;
`

const IngredList = styled.ul`
`

const Ingredients = styled.div`
`

const DietDiv = styled.div`
    display: flex;
    gap: 10px;
    font-style: italic;
`

const RecipeName = styled.h1`
    font-style: italic;
    text-align: center;
`

const RecipeImage = styled.img`
    width: 350px;
    border-radius: 20px;
    border: solid;
    border-color: #4a4a4a;
    border-width: 5px;
`

const RecipeInfo = styled.div`
`

const Wrapper = styled.div`
    margin: 20px;
    .icon {
        width: 40px;
        height: 100%;
    }
    .icon:hover {
        cursor: pointer;
        transition: all 0.5s ease;
        transform: scale(1.2);
    }
`

export default RecipeDetails;