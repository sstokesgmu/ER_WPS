import "./App.css";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, useHelper } from "@react-three/drei";
import { useControls } from "leva";

import { useState, useRef, useEffect } from "react";

import socketService from "./scripts/socket"; //? is this a smart choice

export default function App() {
  //Initialize a connection
  useEffect(() => {
    socketService.connect();  
    //Create Clean up functions
  }, []);



   

  const BoxHelper = () => {
    const ref = useRef();
    useHelper(ref, THREE.BoxHelper, "black");
    const { position, color, opacity, transparent } = useControls({
      position: { x: 0, y: 0.5, z: 0 },
      color: "gray",
      opacity: { value: 0.4, min: 0, max: 1, step: 0.01 },
      transparent: true,
    });

    
    useFrame(({clock})=>{

        if(socketService != null) 
        {
          if(socketService.message.length >= 1)
          {
              const {} = socketService.message[0];
              position.x=coords2D.x;
              position.z=coords2D.y;
              position.y=0;
              //Shift all the elements to the left
              for(let i = 1; i < socketService.message.length-1; i++);
              {
                socketService.message[i-1] = socketService[i];
              }
          }
        }
    });  

    return (
      <mesh ref={ref} position={[...Object.values(position)]}>
        <boxGeometry />
        <meshBasicMaterial
          color={color}
          transparent={transparent}
          opacity={opacity}
        />
      </mesh>
    );
  };



  return (
    <>
      <Canvas camera={{ position: [2, 2, 2] }}>
      <OrbitControls />
      <axesHelper />
      <Grid
        sectionSize={1}
        sectionColor={"black"}
        sectionThickness={1}
        cellSize={1}
        cellColor={"gray"}
        cellThickness={0.5}
        infiniteGrid
        fadeDistance={50}
        fadeStrength={1}
      />
      <BoxHelper />
      </Canvas>
      {/* <button onClick={passData}>Pass Data</button> */}
    </>
    
  );
}

