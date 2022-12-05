import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";
import LoggedOutHome from "./LoggedOutHome";
import LoggedInHome from "./LoggedInHome";

const Home = () => {
    const {isAuthenticated} = useAuth0();
    return (
        <Wrapper>
            {
                !isAuthenticated?
                <LoggedOutHome/>
                :
                <LoggedInHome/>
            }
        </Wrapper>
    )
}

const Wrapper = styled.div`

`


export default Home;