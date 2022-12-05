import { useContext, useState } from "react";
import styled from "styled-components";
import { CurrentUserContext } from "./CurrentUserContext";
import LoadingImage from "./LoadingImage";
import UserViewed from "./UserViewed";
import UserFavourites from "./UserFavourites";
import UserCreations from "./UserCreations";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
    const {currentUser} = useContext(CurrentUserContext);
    const [navSelected, setNavSelected] = useState("Viewed");
    const {isAuthenticated} = useAuth0();
    const handleNav = (e) => {
        setNavSelected(e)
    }
    return (
        <Wrapper>
            {
                isAuthenticated ?
                <ProfileDiv>
            {
                !currentUser ?
                <LoadingImage/>
                :
                <ProfileInfo>
                        <Div>
                        <h1>Welcome back!</h1>
                        <ProfileDetails>
                        <ProfileImage src={currentUser.picture} alt="avatar"></ProfileImage>
                        <Detail>{currentUser._id}</Detail>
                    </ProfileDetails>
                    </Div>
                    <ProfileNav>
                        <Nav className={`${navSelected === "Viewed"? "selected": ""}`} id="viewed" 
                        onClick={(e) => handleNav(e.target.innerText)}>
                            <h3>Viewed</h3>
                        </Nav>
                        <Nav id="favourites" className={`${navSelected === "Favourites"? "selected": ""}`}
                        onClick={(e) => handleNav(e.target.innerText)}>
                            <h3>Favourites</h3>
                        </Nav>
                        <Nav id="creations" className={`${navSelected === "Creations"? "selected": ""}`} 
                        onClick={(e) => handleNav(e.target.innerText)}>
                            <h3>Creations</h3>
                        </Nav>
                    </ProfileNav>
                    {
                        navSelected === "Viewed" ?
                        <UserViewed/>
                        :
                        navSelected === "Favourites" ?
                        <UserFavourites/>
                        :
                        <UserCreations/>
                    }
                </ProfileInfo>
            }
            </ProfileDiv>
            :
            <h2 style={{textAlign: "center"}}>Only logged in users can view their profiles!</h2>
            }
        </Wrapper>
    )
}

const Div = styled.div`
    text-align: center;
`

const Detail = styled.span`
    font-weight: bolder;
    font-style: italic;
    opacity: 60%;
`

const ProfileDiv = styled.div``


const ProfileDetails = styled.div`
    margin-inline: 40px;
    text-align: center;
    display: flex;
    align-items: center;
    gap: 20px;
`

const Nav = styled.div`
    width: calc(100vw/3);
    text-align: center;
    &:hover {
        cursor: pointer;
        border-bottom: solid;
        border-color: #3ebeb2;
        color: #3ebeb2;
    }
`

const ProfileNav = styled.div`
    display: flex;
    width: 100vw;
    margin-bottom: 20px;
    .selected {
        border-bottom: solid;
        border-color: #3ebeb2;
        color: #3ebeb2;
    }
`

const ProfileImage = styled.img`
    border-radius: 50%;
    width: 100px;
    border: solid;
    border-color: #4a4a4a;
    border-width: 5px;
`

const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
`

const Wrapper = styled.div`
`

export default Profile;