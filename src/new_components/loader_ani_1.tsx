import React from "react";
import mulogo from '../images/SVG/acnLOGOgray.svg'
import backgroundLogo from '../images/SVG/dbllogo.svg'


export function LoaderOne({
  diameter = 20,
  numberOfCells = 20,
  color = "red",
}) {
  let output = [];
  let animationStagger = 0.1;
  let styles = {
    animationDuration: "1s",
    width: diameter,
    height: diameter,
    // borderRadius: diameter,
  };
  for (let i = 0; i < numberOfCells; ++i) {
    output.push(
      <div
        key={i}
        className="loader-ani-one"
        style={{ ...styles, animationDelay: `${i * animationStagger}s` }}
      ></div>
    );
  }

  return <div className="ani-container">{output}</div>;
}

export function LoaderThree({
  diameter = 20,
  numberOfCells = 20,
  color = "red",
  delay
}) {
  
  return (<div className="ani-container loader-ani-three" style={{animationDelay:`${delay}s`,backgroundImage:`url(${backgroundLogo})`}}>
    <div>Aacn</div>
    <div>Media</div>
    <div>Uploader</div>
  </div>);
}

