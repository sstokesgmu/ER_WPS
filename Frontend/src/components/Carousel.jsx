import { useState, useEffect } from "react";

export default function Carousel({length, children})
{
    console.log(children.length)
    const [currentIndex, setCurrentIndex] = useState(0);
    const infiniteScrollCalc = (index) => index % length;
    
    useEffect(()=>{
        if (length > 0) {
            const interval = setInterval(()=>{
                setCurrentIndex(previousIndex=> infiniteScrollCalc(previousIndex+1))
            }, 6000);
            return ()=>clearInterval(interval);
        }
    },[length])

    //?Question: does file type matter?
    return <div className="carousel">
                <div className="vignette-overlay"></div>
                {children[currentIndex]}
            </div>
}