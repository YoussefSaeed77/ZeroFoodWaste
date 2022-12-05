import {useEffect, useRef} from "react"; 
import styled from "styled-components";

const UploadWidget = () => {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();
    useEffect(() => {
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: "dhgzfmj7s",
            uploadPreset: "w6zi50mf"
        }, (error, result) => {
        })
    }, [])
    return (
        <Button onClick={()=> {widgetRef.current.open()}}>
            Upload
        </Button>
    )
}

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

export default UploadWidget;