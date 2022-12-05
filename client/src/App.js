import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './NavBar';
import Home from "./Home";
import GlobalStyles from "./GlobalStyles";
import RecipeByIngredients from "./RecipeByIngredients";
import RecipeDetails from "./RecipeDetails";
import Profile from "./Profile";
import UserRecipeDetails from "./UserRecipeDetails";
import UserProfile from "./UserProfile";



const App = () => {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <NavBar />
      <Routes>
        <Route path="/" element = {<Home/>}/>
        <Route path="/ingredients" element ={<RecipeByIngredients/>}/>
        <Route path="/recipe/:id" element={<RecipeDetails/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/profile/:id" element={<UserProfile/>}/>
        <Route path="/user-recipe/:id" element={<UserRecipeDetails/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
