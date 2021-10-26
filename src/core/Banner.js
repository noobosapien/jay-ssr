import React from 'react';
import './Banner.css';
import { useMediaQuery } from './helpers/useMediQuery';


function large(){
    return <>
        <img id="components" src="https://jaytronics.s3.ap-southeast-2.amazonaws.com/carousel/components.svg" alt="components text" />
        <img id="muchmore" src="https://jaytronics.s3.ap-southeast-2.amazonaws.com/carousel/muchmore.svg" alt="much more text" />

        <div id="redBlock" />
        <div id="greenBlock" />
        <div id="yellowBlock" />

        <img id="carText" src="https://jaytronics.s3.ap-southeast-2.amazonaws.com/carousel/automotivetext.svg" alt="car text" />
        <img id="car" src="https://jaytronics.s3.ap-southeast-2.amazonaws.com/carousel/SimpleYellowCarTopView.svg" alt="car" />

        <img id="droneText" src="https://jaytronics.s3.ap-southeast-2.amazonaws.com/carousel/dronetext.svg" alt="drone text" />
        <img id="drone" src="https://jaytronics.s3.ap-southeast-2.amazonaws.com/carousel/drone.svg" alt="drone" />

        <img id="electronicsText" src="https://jaytronics.s3.ap-southeast-2.amazonaws.com/carousel/electronicstext.svg" alt="electronics text" />
        <img id="rpi" src="https://jaytronics.s3.ap-southeast-2.amazonaws.com/carousel/RaspberryPi.svg" alt="microcontroller" />

        <img id="electricalText" src="https://jaytronics.s3.ap-southeast-2.amazonaws.com/carousel/electricaltext.svg" alt="electrical text" />
        <img id="bulb" src="https://jaytronics.s3.ap-southeast-2.amazonaws.com/carousel/bulb.svg" alt="bulb" />
    </>
}

function medium(){
    return <> 
        <img id="mdcomponents" src="https://jaytronics.s3.ap-southeast-2.amazonaws.com/carousel/md/components.png" alt="components text"/>
        <img id="mdmuchmore" src="https://jaytronics.s3.ap-southeast-2.amazonaws.com/carousel/md/muchmore.png" alt="much more text"/>

    
        <img id="mdcarText" src="https://jaytronics.s3.ap-southeast-2.amazonaws.com/carousel/automotivetext.png" alt="car text" />
        <img id="mdcar" src="https://jaytronics.s3.ap-southeast-2.amazonaws.com/carousel/SimpleYellowCarTopView.svg" alt="car" />

        <img id="mddroneText" src="https://jaytronics.s3.ap-southeast-2.amazonaws.com/carousel/dronetext.png" alt="drone text" />
        <img id="mddrone" src="https://jaytronics.s3.ap-southeast-2.amazonaws.com/carousel/drone.svg" alt="drone" />

        <img id="mdelectronicsText" src="https://jaytronics.s3.ap-southeast-2.amazonaws.com/carousel/electronicstext.png" alt="electronics text" />
        <img id="mdrpi" src="https://jaytronics.s3.ap-southeast-2.amazonaws.com/carousel/RaspberryPi.svg" alt="microcontroller" />

        <img id="mdelectricalText" src="https://jaytronics.s3.ap-southeast-2.amazonaws.com/carousel/electricaltext.png" alt="electrical text" />
        <img id="mdbulb" src="https://jaytronics.s3.ap-southeast-2.amazonaws.com/carousel/bulb.svg" alt="bulb" />

    </>
}

function xtraSmall(){
    return <> 
        {medium()}
    </>
}


export default function Banner() {

    const xs = useMediaQuery('(min-width: 0px) and (max-width: 600px)');
    const sm = useMediaQuery('(min-width: 601px) and (max-width: 960px)');
    const md = useMediaQuery('(min-width: 961px) and (max-width: 1280px)');
    const lg = useMediaQuery('(min-width: 1281px) and (max-width: 1920px)');
    const xl = useMediaQuery('(min-width: 1921px)');

    return(
        <>
            <div className={xs || sm ? "banner-xs" : "banner"}>
                {
                    lg || xl ? large() : md || sm ? medium() : xs ? xtraSmall() : <> </>
                }
            </div>
        </>
    );
}