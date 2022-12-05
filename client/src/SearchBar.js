import { useState } from "react";
import styled from "styled-components";
import { useRef } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    const [input, setInput] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const navigate = useNavigate();
    const ref = useRef(null);
    useEffect(() => {
        ref.current.focus();
    }, [])
    const handleChange = (e) => {
        setInput(e.target.value)
    }
    useEffect(() => {
        fetch(`/search-recipes/${input}`)
        .then((res) => res.json()) 
        .then((data) => {
            setSearchResults(data.data);
        })}, [input])

        const handleRecipeClick = (recipe) => {
            navigate(`/recipe/${recipe}`)
        
    }
    return (
        <Wrapper>
            <Input value={input} onChange={handleChange} placeholder="Search recipes" ref={ref}></Input>
            {
                !searchResults ?
                <p></p>
                :
                <ResultsDiv className={`${input === ``? "hidden": ""}`}>
                    {
                        searchResults.map((result) => {
                            return (
                                <Result onClick={()=>{handleRecipeClick(result.id)}}>
                                <h2>{result.title}</h2>
                                </Result>
                            )
                        })
                    }
                </ResultsDiv>
            }
        </Wrapper>
    )
}

const Result = styled.div`
    border-radius: 20px;
    margin-top: -10px;
    &:hover{
        background-color: #3ebeb2;  
        cursor: pointer;
        color: white;
    }
`

const ResultsDiv = styled.div`
    border-bottom: solid;
    border-right: solid;
    border-left: solid;
    position: relative;
    bottom: 50px;
    padding-top: 50px;
    padding-inline: 20px;
    text-align: center;
    border-color: black;
    border-radius: 30px;
`

const Wrapper = styled.div`
    margin-top: 20px;
    .hidden {
        display: none;
    }
`

const Input = styled.input`
position: relative;
    z-index: 10;
    border-radius: 30px;
    width: 400px;
    height: 50px;
    padding-inline: 20px;
    border-color: #4a4a4a;
    &:focus {
        border-color: #4a4a4a;
    }
`

export default SearchBar;