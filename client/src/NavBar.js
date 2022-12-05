import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import {RiFridgeFill} from "react-icons/ri"
import {FaHome, FaUserCircle} from "react-icons/fa"

const NavBar = () => {
    const { loginWithRedirect, logout, isAuthenticated} = useAuth0();
    return (
        <Wrapper>
            <NavDiv>
                <NavItem to ="/"> <FaHome/> </NavItem>
                <NavItem to="/ingredients"><RiFridgeFill/></NavItem>
                {   
                    !isAuthenticated?
                    <NavItem onClick={() => {loginWithRedirect()}}>Log In</NavItem>
                    :
                    <LoggedInDiv>
                    <NavItem to="/profile"><FaUserCircle/></NavItem>
                    <NavItem onClick={()=> {logout({ returnTo: window.location.origin })}}>Log out</NavItem>
                    </LoggedInDiv>
                }
            </NavDiv>
        </Wrapper>
    )
}

const LoggedInDiv = styled.div`
    width: 25vw;
    display: flex;
    justify-content: space-between;
`

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

const NavDiv = styled.div`
    display: flex;
    width: 100vw;
    justify-content: space-evenly;
    background-color: #3ebeb2;
    color: white;
    padding: 10px;
`

const NavItem = styled(NavLink)`
    color: #4a4a4a;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    font-weight: bolder;
    font-size: 20px;
    &:hover {
        color: whitesmoke;
        transition: all 0.3s ease;
    }
    &:active{
        color: whitesmoke;
    }
`

export default NavBar;