import styled from "styled-components"

const LoadingImage = () => {
    return (
        <Image alt="loading" src="/ezgif.com-gif-maker3.gif"></Image>
    )
}

const Image = styled.img`
    width: 100px;
    position: relative;
    box-shadow: none;
    left: 47vw;
    top: 30vh;
`

export default LoadingImage;