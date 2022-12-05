import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CurrentUserContext } from "./CurrentUserContext";

const EditRecipe = (data) => {
    const {currentUser} = useContext(CurrentUserContext);
    const recipeFound = currentUser.creations.find((element) => element._id === data.data);
    const {setUpdated} = useContext(CurrentUserContext);
    const {isAuthenticated} = useAuth0();
    const [instructions, setInstructions] = useState(recipeFound.instructions);
    const [showStepsDiv, setShowStepsDiv] = useState(false);
    const [formData, setFormData] = useState({
        _id: data.data,
        userId: currentUser._id,
        vegetarian: recipeFound.vegetarian, 
        vegan: recipeFound.vegan, 
        glutenFree: recipeFound.glutenFree,
        title: recipeFound.title,
        summary: recipeFound.summary,
        servingNumber: recipeFound.servingNumber,
        readyInMinutes: recipeFound.readyInMinutes
    });
    const [step, setStep] = useState({});
    const [ingredients, setIngredients] = useState(recipeFound.ingredients);
    const [ingredient, setIngredient] = useState('');
    const [showIngredientsDiv, setShowIngredientsDiv] = useState(false);
    const [missingInfo, setMissingInfo] = useState(false);
    const navigate = useNavigate();
    const handleStepChange = (key, value) => {
        setStep({
            ...step,
            [key]: value
        })
    }
    const handleAddStep = (e) => { 
        e.preventDefault();
        setInstructions(current => [...current, step])
        setStep(
            {stepNumber: '', step: '', equipment: ''}
        )
    }
    const removeStep = (item) => {
        setInstructions(current => current.filter((step) => {
            return step !== item
        }))
    }
    const handleSaveSteps = (e) => {
        const sortedInstructions = instructions.sort(({stepNumber: a}, {stepNumber: b})=> a-b);
        setFormData({...formData, instructions: sortedInstructions})
        setShowStepsDiv(true)
    }
    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value
        })
    }
    const handleIngredientChange = (value) => {
        setIngredient(value);
    }
    const handleAddIngredient = (e) => {
        e.preventDefault();
        if (ingredient.length > 0) {
            setIngredients(current => [...current, ingredient])
            setIngredient('')
    }}
    const removeIngredient = (item) => {
        setIngredients(current => current.filter((ingredient) => {
            return ingredient !== item
        }))
    }
    const saveIngredients = () => {
        setFormData({...formData, ingredients: ingredients})
        setShowIngredientsDiv(true)
    }

    
    useEffect(() => {
        if (!(formData.title === undefined || formData.summary === undefined || formData.ingredients === undefined ||
            formData.servingNumber === undefined || formData.instructions === undefined || formData.readyInMinutes === undefined)) {
                setMissingInfo(false);
            }
    }, [formData])

    const handleCreate = () => {
        if (formData.title === undefined || formData.summary === undefined || formData.ingredients === undefined ||
            formData.servingNumber === undefined || formData.instructions === undefined || formData.readyInMinutes === undefined) {
                setMissingInfo(true);
            }
            else {
            fetch("/update-recipe", {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then((data) => {
            window.location.reload();
        })
    }
    }

    return (
        <>
        {
            !isAuthenticated ?
            <p>Only logged in users can create recipes!</p>
            :
            <Wrapper>
            <h2>Recipe details:</h2>
            <Form>
            <InputDiv>
                <Label htmlFor="title">Recipe title: </Label>
                <Input required id="title" value={formData.title}
                type="text" onChange={(e) => handleChange(e.target.id, e.target.value)}></Input>
            </InputDiv>
            <DietDiv>
                <DietDiv2>
                    <Label htmlFor="vegetarian">Vegetarian</Label>
                    <InputDiet required id="vegetarian" checked={formData.vegetarian} 
                    type="checkbox" onChange={(e) => {handleChange(e.target.id, !formData.vegetarian)}}></InputDiet>
                </DietDiv2>
                <DietDiv2>
                    <Label htmlFor="vegan">Vegan</Label>
                    <InputDiet required id="vegan"  checked={formData.vegan} 
                    type="checkbox" onChange={(e) => {handleChange(e.target.id, !formData.vegan)}}></InputDiet>
                </DietDiv2>
                <DietDiv2>
                    <Label htmlFor="glutenFree">Gluten-free</Label>
                    <InputDiet required id="glutenFree"  checked={formData.glutenFree} 
                    type="checkbox" onChange={(e) => {handleChange(e.target.id, !formData.glutenFree)}}></InputDiet>
                </DietDiv2>
            </DietDiv>
                <SummaryDiv>
                <Label htmlFor="summary">Summary: </Label>
                <Summary required id="summary" value={formData.summary}
                onChange={(e) => {handleChange(e.target.id, e.target.value)}}
                placeholder="Write a summary for your recipe!"
                ></Summary>
                </SummaryDiv>
            <InputDiv>
                <Label htmlFor="servingNumber">Serving number:</Label>
                <Input required id="servingNumber"  type="number" value={formData.servingNumber}
                onChange={(e) => {handleChange(e.target.id, e.target.value)}}></Input>
            </InputDiv>
            <InputDiv>
                <Label htmlFor="servingNumber">Total cooking time:</Label>
                <Input required id="readyInMinutes"  
                placeholder="ex. 45 minutes, 1 hour 30 minutes etc.."
                value={formData.readyInMinutes}
                type="text" onChange={(e) => {handleChange(e.target.id, e.target.value)}}></Input>
            </InputDiv>
            </Form>
                <h2>Recipe instructions:</h2>
                {            
                    showStepsDiv ?
                    <SavedSteps>
                        <Steps>
                        {
                            formData.instructions.map((step) => {
                                return (
                                <Step key={step.stepNumber}>
                                    <div>
                                    <p>{step.stepNumber}. Equipment: {step.equipment}.</p>
                                    <p>{step.step}</p>
                                    </div>
                                </Step>)
                            })
                        }
                        </Steps>
                        <Button onClick={() => {setShowStepsDiv(false)}}>Edit steps</Button>
                    </SavedSteps>
                    :
                    <UnSavedSteps>
                    <FormInstructions onSubmit={(e) => {handleAddStep(e)}}>
                        <div>
                        <InputDiv>
                            <Label htmlFor="stepNumber">Step number: </Label>
                            <Input required id="stepNumber" 
                            value={step.stepNumber}
                            type="number" onChange={(e) => handleStepChange(e.target.id, e.target.value)}></Input>
                        </InputDiv>
                        <InputDiv>
                            <Label htmlFor="equipment">Equipment: </Label>
                            <Input required id="equipment" type="text" 
                            value={step.equipment}
                            onChange={(e) => handleStepChange(e.target.id, e.target.value)}></Input>
                        </InputDiv>
                        <InputDiv>
                            <Label htmlFor="step">Step: </Label>
                            <RecipeInstruction required id="step" 
                            value={step.step}
                            type="text" onChange={(e) => handleStepChange(e.target.id, e.target.value)}></RecipeInstruction>
                        </InputDiv>
                        </div>
                    <Button type="submit">Add Step</Button>
                </FormInstructions>
                {
                        instructions.length > 0?
                        <Steps>
                            {
                                instructions.map((step) => {
                                    return (
                                        <Step key={step.stepNumber}>
                                            <div>
                                            <p>{step.stepNumber}. Equipment: {step.equipment}.</p>
                                            <p>{step.step}</p>
                                            </div>
                                            <RemoveStep onClick={() => {removeStep(step)}}>X</RemoveStep>
                                        </Step>
                                    )
                                })
                            }
                            <Button onClick={() => {handleSaveSteps()}}>Save Steps</Button>
                        </Steps>
                        :
                        <p></p>
                    }</UnSavedSteps>}
                    <h2>Recipe ingredients:</h2>
                    {   
                        !showIngredientsDiv ?
                        <>
                        <AddIngredientDiv onSubmit={(e) => {handleAddIngredient(e)}}>
                        <InputDiv>
                        <Label htmlFor="ingredient">Ingredient: </Label>
                        <Input type="text" id="ingredient"
                        placeholder="ex. 1 cup sugar"
                        required
                        name="ingredient" 
                        value={ingredient}
                        onChange={(e) => {handleIngredientChange(e.target.value)}}></Input>
                        </InputDiv>
                        <Button type="submit">Add Ingredient</Button>
                        </AddIngredientDiv>
                        <UnsavedIngredients>
                            {
                                ingredients.length > 0? 
                                <div>
                                <IngredientsList>
                                    {
                                        ingredients.map((ingredient) => {
                                            return (
                                                <IndividualIngredient key={ingredient}>
                                                <p>{ingredient}</p>
                                                <RemoveIngredient onClick={()=> {removeIngredient(ingredient)}}>X</RemoveIngredient>
                                                </IndividualIngredient>
                                            )
                                        })
                                    }
                                </IngredientsList>
                                <Button onClick={()=>{saveIngredients()}}>Save Ingredients</Button>
                                </div>
                                :<p></p>
                            }
                        </UnsavedIngredients>
                        </>
                        :
                        <SavedIngredients>
                                <IngredientsList>
                                    {
                                        ingredients.map((ingredient) => {
                                            return (
                                                <IndividualIngredient key={ingredient}>
                                                <p>{ingredient}</p>
                                                </IndividualIngredient>
                                            )
                                        })
                                    }
                                </IngredientsList>
                                <Button onClick={()=>{setShowIngredientsDiv(false)}}>Edit Ingredients</Button>
                        </SavedIngredients>
                    }
                    {
                        missingInfo ? 
                        <MissingInfo>
                            <h2>Please fill out all the fields and/or save your ingredients/instructions before saving your changes!</h2>
                        </MissingInfo>
                        :
                        <p></p>
                    }
                    <CreateButton onClick={() => {handleCreate()}}>Save Changes</CreateButton>
        </Wrapper>
        }
        </>
    )
}

const RecipeInstruction = styled.textarea`
        width: 150px;
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
`

const MissingInfo = styled.div`
    margin-top: 20px;
    width: 100%;
    text-align: center;
    background-color: pink;
    border-radius: 20px;
`

const CreateButton = styled.button`
    position: relative;
    left: 85%;
    width: 150px;
    margin: 10px;
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
const RemoveStep = styled.button`
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
    }
    &:active {
        transition: all 0.5s ease;
        transform: scale(0.9)
    }
`

const AddIngredientDiv = styled.form`
    display: flex;
    align-items: center;
    gap: 20px;
`

const SummaryDiv = styled.div`
    display: flex;
    align-items: center;
    width: 70vw;
    gap: 20px;
`

const InputDiet = styled.input`
`

const DietDiv2 = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

const DietDiv = styled.div`
    display: flex;
    width: 100vw;
    align-items: space-evenly;
    justify-content: space-evenly;
`
const IndividualIngredient = styled.div`
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    padding-inline: 10px;
    margin-top: 10px;
    background-color: #4a4a4a;
    color: white;
    display: flex;
    gap: 5px;
    align-items: center;
    max-width: 100%;
    padding: 5px;
    border-radius: 20px;
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
    }
    &:active {
        transition: all 0.5s ease;
        transform: scale(0.9)
    }
`

const IngredientsList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-bottom: 20px;
`

const SavedIngredients = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const UnsavedIngredients = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const UnSavedSteps = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
`

const SavedSteps = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Step = styled.div`
    width: 70vw;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    background-color: lightgray;
    padding: 5px;
    color: #4a4a4a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 20px;
`

const Steps = styled.div`
    margin-top: 10px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`

const FormInstructions = styled.form`
    display: flex;
    align-items: center;
    gap: 20px;
`

const Summary = styled.textarea`
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

const Input = styled.input`
    border-radius: 30px;
    width: 150px;
    height: 30px;
    padding-inline: 20px;
    border-color: #4a4a4a;
    &:focus {
        border-color: #4a4a4a;
    }
`

const Label = styled.label`
    color: #4a4a4a;
    font-weight: bolder;
    font-family: Garamond;
    letter-spacing: 1px;
`

const InputDiv = styled.div`
    display: flex;
    width: 25vw;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`

const Form = styled.form`
`

export default EditRecipe;