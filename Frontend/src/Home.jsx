import "./Home.css"
import axios from "axios";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import Carousel from "./components/Carousel";
/**
 * Contents Page 
 * |
 * either
 * -> Carosuel with image or video
 * -> Image or video  
**/

export function ContentReciever({packet, OutputComponent}){
    const [contentUrls, setContentUrls] = useState([]);
    const {route} = packet;
    useEffect(() => {
        axios.get(`http://localhost:3404/${route}`)
        .then((response) => {
            console.log("Response: ", response.status);    
            //TODO: Based on the file type select a matching HTML tag or Component
            setContentUrls(response.data);
        })
        .catch((error) => {
            console.log(error)
        })
    }, [route]);

    return(
        <OutputComponent length={contentUrls.length}>
            {/* {console.log("ContentUrls: ", contentUrls)} */}
            {contentUrls.map((url,index)=>{
                return <img key={index}src={url} alt={`image-${index}`}/>
            })}
        </OutputComponent>
    );
    
}

function StartApplication(navigate){
    navigate("/Dashboard");
}


export default function Home(){
    let navigate = useNavigate();
    return (
        <>
            <div className="fill-screen">
                <ContentReciever packet={{route: "landingPage_images"}} OutputComponent={Carousel} />
            </div>
            <div className="Landing-Page-Container">
                    <p>Elden-Map</p>
                    <p>Track your journey and learn more about the world of Elden Ring, while in Game</p>
                    <button onClick={()=>StartApplication(navigate)}>Start</button>
            </div>
        </>
        
    )
}



 {/* <iframe       
            src="https://www.youtube.com/embed/E3Huy2cdih0?list=PLmHOAiT_F2MPeOTrLEMDdLx9nfUW-3827&index=2&controls=0&modestbranding=1+&autoplay=1&mute=1"
            title="YouTube video player"
            allow="autoplay; encrypted-media"
            allowFullScreen
            ></iframe> */}