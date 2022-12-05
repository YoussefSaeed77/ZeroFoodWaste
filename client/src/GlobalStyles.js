import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
body{
    font-family: Garamond;
    color: #4a4a4a;
    margin:0;
    padding:0;
}
h1,h4,h2, h3{
    position: relative;
    top: 25%;
    letter-spacing: 5px;
}
h2 {
    font-style:italic;
}
img {
    box-shadow: rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
}
`