import styled from "styled-components";

const DeleteRecipe = (data) => {
    const handleDelete = () => {
        fetch("/delete-user-recipe", {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({_id: data.recipeId})
        })
        .then(res => res.json())
        .then((data) => {
            window.location.reload();
        })
    }
    return (
        <Wrapper>
        <h2>Are you sure you want to delete this recipe?</h2>
        <Buttons>
            <Button onClick={() => {handleDelete()}}>Delete</Button>
            <Button onClick={() => {data.delete(false)}}>Keep</Button>
        </Buttons>
        </Wrapper>
    )
}

const Button = styled.button`
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

const Buttons = styled.div`
    display: flex;
    gap: 40px;
    align-items: center;
    justify-content: center;
`

const Wrapper = styled.div`
    text-align: center;
`

export default DeleteRecipe;