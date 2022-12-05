import { useState, useEffect } from "react";
import styled from "styled-components";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import LoadingImage from "./LoadingImage";
import { CurrentUserContext } from "./CurrentUserContext";
import { useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import RecommendedRecipes from "./RecommendedRecipes";
import LoggedOutHome from "./LoggedOutHome"

const LoggedInHome = () => {
    const {currentUser} = useContext(CurrentUserContext);
    return (
        <>
        {
            !currentUser ?
            <LoadingImage/>
            :
            <Wrapper>
                {
                    !currentUser.favouriteList.length > 0 ?
                    <LoggedOutHome/>
                    :
                    <RecommendedRecipes/>
                }
            </Wrapper>
        }
        </>
    )
}

const Detail = styled.span`
    font-weight: bold;
    font-style: italic;
    font-size: 12px;
`

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


export default LoggedInHome;