import { useContext, useState } from "react";
import styled from "styled-components";
import CreateRecipe from "./CreateRecipe";
import { CurrentUserContext } from "./CurrentUserContext";
import EditRecipe from "./EditRecipe";
import LoadingImage from "./LoadingImage";
import {RiDeleteBin5Fill, RiEdit2Fill} from "react-icons/ri"
import { useNavigate } from "react-router-dom";
import DeleteRecipe from "./DeleteRecipe";
import Modal from "react-modal";

const UserCreations = () => {
    const {currentUser} = useContext(CurrentUserContext);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [recipeId, setRecipeId] = useState("");
    const navigate = useNavigate();
    const afterOpenModal = () => {};
    const customStyles = {
        content: {
        borderRadius: "20px",
        width: "400px",
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        padding: "30px",
        boxShadow:
            "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
        },
    };
    const handleShow = () => {
        setShowCreate(true)
    } 
    const handleShowEdit = (recipe, e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowEdit(true);
        setRecipeId(recipe._id);
    }
    const handleClose = () => {
        setShowCreate(false)
        setShowEdit(false)
        setShowDelete(false)
    }
    const handleShowDelete = (recipe, e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDelete(true);
        setRecipeId(recipe._id);
    }
    return (
        <Wrapper>
            {
                !currentUser ?
                <LoadingImage/>
                :
                <Creations className={`${showCreate || showEdit? "hidden": ""}`}>
                    {
                        currentUser.creations.length === 0 ?
                        <h2 style={{opacity: "60%", fontStyle: "italic"}}>
                            You currently have no creations! Show us your cooking skills and create your own recipe!
                        </h2>
                        :
                        <Recipes>
                            {
                                currentUser.creations.map((recipe) => {
                                    return (
                                        <Recipe key={recipe._id} onClick={()=> {navigate(`/user-recipe/${recipe._id}`)}}>
                                            <Header>
                                                <RiEdit2Fill className="icon" onClick={(e) => {handleShowEdit(recipe, e)}}/>
                                                <RiDeleteBin5Fill className="icon" onClick={(e) => {handleShowDelete(recipe,e)}}/>
                                            </Header>
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
                        </Recipes>
                    }
                    <CreateButton onClick={()=> {handleShow()}}>Create</CreateButton>
                </Creations>
            }
            {
                showCreate ?
                <CreateDiv>
                    <CloseButton onClick={()=> {handleClose()}}>X</CloseButton>
                    <CreateRecipe/>
                </CreateDiv>
                :
                <p></p>
            }
            {
                showEdit ?
                    <EditDiv>
                        <CloseButton onClick={()=> {handleClose()}}>X</CloseButton>
                        <EditRecipe data={recipeId}/>
                    </EditDiv>
                    :
                    <p></p>
            }
            <Modal
            isOpen={showDelete}
            onAfterOpen={afterOpenModal}
            onRequestClose={handleClose}
            style={customStyles}
            contentLabel="Delete modal"
            >
            <CloseButton onClick={handleClose}>X</CloseButton>
            <DeleteRecipe recipeId={recipeId} delete={setShowDelete}/>
            </Modal>
        </Wrapper>
    )
}

const Header = styled.div`
    display: flex;
    gap: 25px;
    align-items: flex-end;
    justify-content: flex-end;
    width: 100%;
    .icon {
        height: 30px;
        width: 30px;
    }
    .icon:hover{
        color: #3ebeb2;
        cursor: pointer;
    }
`

const Detail = styled.span`
    font-weight: bold;
    font-style: italic;
`

const EditDiv = styled.div`
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    margin: 20px;
    padding: 40px;
    border-radius: 20px;
`

const Ingredients = styled.div``

const CloseButton = styled.button`
    position: relative;
    left: 100%;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    bottom: 20px;
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

const CreateDiv = styled.div`
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    margin: 20px;
    padding: 40px;
    border-radius: 20px;
`

const CreateButton = styled.button`
    margin: 10px;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    border: none;
    padding: 10px;
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

const Creations = styled.div`
    text-align: center;
    margin: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px;
    text-align: center;
`

const Wrapper = styled.div`
    margin: 20px;
    .hidden {
        display: none;
    }
`

export default UserCreations;