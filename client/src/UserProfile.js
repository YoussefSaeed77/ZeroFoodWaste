import { useEffect } from "react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components"

const UserProfile = () => {
    const {id} = useParams();
    const [profile, setProfile] = useState(null)
    useEffect(()=> {
            fetch(`/get-user/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProfile(data.data)
            })
    },[])
    const navigate = useNavigate();
    return (
        <Wrapper>
            {
                !profile ?
                <Loading alt="loading" src="/ezgif.com-gif-maker3.gif" 
                style={{position: "relative", left:"43vw", marginTop: '20px', top: "20vh"}}/>
                :
                <div>
                <ProfileInfo>
                    <ProfileImage src={profile.picture}/>
                    <Detail>{profile._id}</Detail>
                </ProfileInfo>
                <Recipes>
                <h2>Creations: </h2>
                {profile.creations.length === 0 ?
                <h2 style={{opacity: "60%", fontStyle: "italic"}}>This user currently has no creations.</h2>
                :
                <div>  
                            {
                                profile.creations.map((recipe) => {
                                    return (
                                        <Recipe key={recipe._id} onClick={()=> {navigate(`/user-recipe/${recipe._id}`)}}>
                                            <h2>{recipe.title}</h2>
                                            <Ingredients>
                                                <p>Ingredients: {
                                                    recipe.ingredients.length === 0 ?
                                                    <Detail> none.</Detail>
                                                    :
                                                    recipe.ingredients.map((ingredient, index) => {
                                                        return (
                                                            index !== recipe.ingredients.length -1?
                                                            <Detail>{ingredient}, </Detail>
                                                            :
                                                            <Detail>{ingredient}.</Detail>
                                                            )
                                                            })
                                                }</p>
                                            </Ingredients>
                                        </Recipe>
                                    )
                                }) 
                            }
                </div>
            }
                        </Recipes>
                </div>
            }
        </Wrapper>
    )
}

const Detail = styled.span`
    font-weight: bolder;
    font-style: italic;
    opacity: 60%;
`

const Loading = styled.img`
    width: 100px;
    position: relative;
    box-shadow: none;
`

const ProfileImage = styled.img`
    border-radius: 50%;
`

const ProfileInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`

const Wrapper = styled.div`
    margin: 30px;
`

const Ingredients = styled.div``

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
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`



export default UserProfile;