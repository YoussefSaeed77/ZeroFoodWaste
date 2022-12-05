import {createContext, useEffect} from "react";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const CurrentUserContext = createContext(null);

export const CurrentUserProvider = ({children}) => {
    // const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [updated, setUpdated] = useState(false);
    const {isAuthenticated} = useAuth0();
    const userDetails = useAuth0().user;
    const [userPosted, setUserPosted] = useState(false);
    useEffect(() => {
        if (isAuthenticated && userDetails !== undefined) {
            fetch("/add-user", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userDetails)
            })
            .then(res => res.json())
            .then((data) => {
            })
            setUserPosted(true);
        }
    },
    [userDetails])
    useEffect(()=> {
        if (isAuthenticated && userDetails !== undefined) {
            fetch(`/get-user/${userDetails.email}`)
            .then((res) => res.json())
            .then((data) => {
                setCurrentUser(data.data)
            })
        }
    },
    [userPosted, updated])
    return (
        <CurrentUserContext.Provider value ={{currentUser, setCurrentUser, updated, setUpdated}}>
            {children}
        </CurrentUserContext.Provider>
    )
}