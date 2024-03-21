import React, { useState } from "react";
import { Button } from "antd"
import { Wrapper } from "./style";

const WaterMark = React.memo(function() {

  let [baseURl, setBaseURl] = useState('')

  const handleFileChange = (e) => {
    const file = e.nativeEvent.target.files[0]
    setBaseURl(URL.createObjectURL(new Blob([file])))
    // console.log(URL.createObjectURL(new Blob([file])))
    // const img = new Image()
    // img.onload = () => {
    //   console.log(img, "baseURl")
    //   const canvas = document.createElement('canvas');
    //   const ctx = canvas.getContext('2d');
    //   canvas.width = img.width;
    //   canvas.height = img.height;
    //   canvas.style.width = img.width + 'px';
    //   canvas.style.height = img.height + 'px';
    //   ctx.drawImage(img, 0, 0, img.width, img.height)
    //   const baseURl = canvas.toDataURL();
    //   console.log(img, "baseURl", baseURl)
    //   setBaseURl(baseURl)
    // }
    // img.src = URL.createObjectURL(new Blob([file]))

  }
  return (
    <Wrapper>
      <div>
        <Button>
        <input type="file" onChange={handleFileChange}></input>
        </Button>
      </div>
      <div>
        <img src={baseURl} width="300" height="300" />
      </div>
    </Wrapper>
  )

})

export default WaterMark