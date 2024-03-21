import React, { useEffect, useRef, useState } from "react";
import { Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons"
import { CanvasWrapper } from "./style";
import {
  getDotPosition,
  getDashPosition,
  getMousePosi,
  getCursorStyle,
  checkSelectBoundary,
  handleMouseInfo,
  getGrayscaleData,
  getPhotoData,
  getAnewXY
} from './utils'

let createURL = '';
let ctx = null;
let ratio = 2;
let initSize = {};

let image = null;
let imgSize = {};
let imgScale = 0;

let canvasSize = {};


let isCover = false;

let canChangeSelect = false; // 是否开始绘制
let initMousePosi = []; // mousedown的位置
let mousePosi = []; // mousemove之后，边界位置，四个角和四个边
let resetSelect = false; // 重新绘制
let cursorIndex = 9; // 鼠标行为
let selectPosi = {
  x: 0,
  y: 0,
  w: 0,
  h: 0
};
let tempCursorIndex = 0;

let rotate = 0; // 旋转
let grayscale = false; // 灰度


const Canvas = React.memo(function() {
  const [fileList, setFileList] = useState([])
  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    showUploadList: false,
    fileList,
  }
  const canvasRef = useRef();
  let [dataUrl, setDataUrl] = useState(''); // 下载地址

  useEffect(() => {
    initSize = {
      width: 500, height: 500, proportion: 1
    }
    ctx = canvasRef.current.getContext('2d')
    if (fileList.length) {
      createCanvas()
    }
  }, [fileList])

  // 图片缩小比例
  const initImageCanvas = (img) => {
    const { width: imgWidth, height: imgHeight } = img;
    const imgProportion = imgWidth / imgHeight;

    imgSize = {
      width: imgWidth,
      height: imgHeight
    };

    if (imgWidth <= initSize.width && imgHeight <= initSize.height) {
      imgScale = 1;
      return;
    };

    if (imgProportion > initSize.proportion) {
      imgScale = initSize.width / imgWidth;
    } else {
      imgScale = initSize.height / imgHeight;
    };
  };

  // canvas比例
  const calcCanvasSize = () => {
    if (!canvasRef.current) {
      throw new Error('canvasRef not dom');
    };

    let canvasWidth = Math.min(initSize.width, imgSize.width * imgScale);
    let canvasHeight = Math.min(initSize.height, imgSize.height * imgScale);

    // 旋转
    if (rotate % 180 !== 0) {
      [canvasWidth, canvasHeight] = [canvasHeight, canvasWidth];
    };

    canvasRef.current.style.width = `${canvasWidth}px`;
    canvasRef.current.style.height = `${canvasHeight}px`;
    canvasRef.current.width = canvasWidth * ratio;
    canvasRef.current.height = canvasHeight * ratio;

    ctx.scale(ratio, ratio);

    canvasSize = {
      width: canvasWidth,
      height: canvasHeight
    };

    mousePosi = [];
  };

  // 画蒙层
  const drawCover = () => {
    if (!isCover) {
      isCover = true
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
      ctx.globalCompositeOperation = 'source-atop';
      ctx.restore();
    }
  };

  // 画选中框
  const drawSelect = (x, y, w, h) => {
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    drawCover();
    ctx.save();

    // 外框
    ctx.clearRect(x, y, w, h);
    ctx.strokeStyle = '#5696f8';
    ctx.strokeRect(x, y, w, h);

    // 画锚点
    ctx.fillStyle = '#5696f8';
    const dots = getDotPosition(x, y, w, h);
    dots.map(i => ctx.fillRect(...i));

    //画虚线
    ctx.strokeStyle = 'rgba(255, 255, 255, .75)';
    ctx.lineWidth = 1;
    const lines = getDashPosition(x, y, w, h)
    lines.map(v => {
      ctx.beginPath();
      ctx.setLineDash([2, 4]);
      ctx.moveTo(v[0], v[1])
      ctx.lineTo(v[2], v[3])
      ctx.closePath();
      ctx.stroke();
    })

    ctx.restore();

    drawImage();

    mousePosi = getMousePosi(x, y, w, h);
    mousePosi.push([selectPosi.x, selectPosi.y, selectPosi.w, selectPosi.h]);
  }


  const drawImage = () => {
    let { height: canvasHeight, width: canvasWidth } = canvasSize
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';


    // canvas以左上角有旋转角，所以，移动中心到做左上角，在移动到中心
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate(Math.PI / 180 * rotate); //一个pi时180度
    if (rotate % 180 !== 0) {
      [canvasWidth, canvasHeight] = [canvasHeight, canvasWidth];
    };
    ctx.translate(-canvasWidth / 2, - canvasHeight / 2);
    // 放大缩小
    const imgScaleWidth = imgSize.width * imgScale;
    const imgScaleHeight = imgSize.height * imgScale;

    ctx.drawImage(
      image, 
      (canvasWidth - imgScaleWidth) / 2, (canvasHeight - imgScaleHeight) / 2, 
      imgScaleWidth, imgScaleHeight
    )
    
    // 灰度
    if (grayscale) {
      const imgData = ctx.getImageData(0, 0, canvasSize.width * ratio, canvasSize.height * ratio);
      getGrayscaleData(imgData);
      ctx.putImageData(imgData, 0, 0);
    };

    ctx.restore();
  }

  const checkInPath = (pathX, pathY, rectPosi) => {
    ctx.beginPath();
    ctx.rect(...rectPosi);
    const result = ctx.isPointInPath(pathX, pathY)
    ctx.closePath();
    return result;
  }

  const mouseDown = (e) => {
    if (!image) return

    // 是否重新绘制
    if (cursorIndex === 9) {
      resetSelect = true;
    };
    // 开始绘制
    canChangeSelect = true;

    const { offsetX, offsetY } = e.nativeEvent
    initMousePosi = {
      x: offsetX,
      y: offsetY
    };
  }

  const mouseMove = (e) => {
    if (!image) return

    let cursor = 'crosshair';
    cursorIndex = 9;
    
    const { offsetX, offsetY } = e.nativeEvent
    const pathX = offsetX * ratio
    const pathY = offsetY * ratio

    // 判断鼠标行为
    // mousePosi 上次绘画结束时的边界[左上, 右上, 右下, 左下, 上, 右, 下, 左]
    for(let i = 0; i < mousePosi.length; i++) {
      const isEdge = checkInPath(pathX, pathY, mousePosi[i])
      if(isEdge) {
        cursor = getCursorStyle(i);
        cursorIndex = i;
        break;
      }
    }
    canvasRef.current.style.cursor = cursor;
    if (!canChangeSelect) return

    // 判断是否需要重新绘制
    const distanceX = offsetX - initMousePosi.x
    const distanceY = offsetY - initMousePosi.y
    if(resetSelect) { // 首次绘画位置
      selectPosi = {
        x: initMousePosi.x,
        y: initMousePosi.y,
        w: 4,
        h: 4
      }
      tempCursorIndex = 2;
      resetSelect = false;
    }
    // 需要绘制的位置，0-左上角 1-右上角 2-右下角 3-左下角 4-上 5-右 6-下 7-左 8-拖拽 
    selectPosi = handleMouseInfo(
      tempCursorIndex !== null ? tempCursorIndex : cursorIndex,
      selectPosi,
      { x: distanceX, y: distanceY }
    );
    // 边界处理
    selectPosi = checkSelectBoundary(canvasSize.width, canvasSize.height, selectPosi)

    const { x, y, w, h } = selectPosi

    drawSelect(x, y, w, h)

    initMousePosi = {
      x: offsetX,
      y: offsetY
    };

    if (tempCursorIndex === null) {
      tempCursorIndex = cursorIndex;
    };
  }

  const mouseUp = async (e) => {
    if (selectPosi.w < 0 || selectPosi.h < 0) {
      selectPosi = getAnewXY(selectPosi);
      const { x, y, w, h } = selectPosi;
      mousePosi = getMousePosi(x, y, w, h);
    };

    if (canChangeSelect) {
      dataUrl && (window.URL.revokeObjectURL(dataUrl));
      const payload = {
        imgSize, rotate, img:image, canvasSize, imgScale, selectPosi, grayscale
      };
      const blob = await getPhotoData(payload);
      const url = window.URL.createObjectURL(blob)
      setDataUrl(url)
    }
    canChangeSelect = false;
    tempCursorIndex = null;
  }

  const handleRotate = () => {
    rotate = rotate == 270 ? 0 : rotate + 90
    calcCanvasSize()
    drawImage()
  }

  const handleZoomIn = () => {
    imgScale += 0.1;
    if (imgScale > 2) {
      imgScale = 2;
    }
    calcCanvasSize();
    drawImage();
  }
  const handleZoomOut = () => {
    imgScale -= 0.1;
    if (imgScale < 0.1) {
      imgScale = 0.1;
    }
    calcCanvasSize();
    drawImage();
  }

  const handleGray = () => {
    grayscale = !grayscale;
    mousePosi = [];
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    drawImage();
  }

  const handleReset = () => {
    rotate = 0;
    grayscale = false;
    initImageCanvas(image);
    calcCanvasSize();
    drawImage();
    setDataUrl('');
  }

  function createCanvas() {
    if (createURL) {
      window.URL.revokeObjectURL(createURL);
    };
    createURL = URL.createObjectURL(fileList[0])
    image = new Image()
    image.onload = () => {
      initImageCanvas(image);
      calcCanvasSize();
      drawImage();
    }
    image.src = createURL
  }

  return (
    <CanvasWrapper>
      <div className="imgselect">
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>选择图片</Button>
        </Upload>
      </div>
      <div className="pane">
        <div className="canvas-box" onMouseUp={mouseUp}>
          <canvas 
            ref={canvasRef} 
            id="canvas" 
            onMouseDown={mouseDown} 
            onMouseMove={mouseMove}
          ></canvas>
        </div>
        <div className="tool">
          <img src={dataUrl} width="100px" height="100px" />
          <Button onClick={handleRotate}>旋转</Button>
          <Button onClick={handleZoomIn}>放大</Button>
          <Button onClick={handleZoomOut}>缩小</Button>
          <Button onClick={handleGray}>灰度</Button>
          <Button onClick={handleReset}>重置</Button>
          <Button><a href={dataUrl} download="canvas.png">下载</a></Button>
        </div>
      </div>
    </CanvasWrapper>
  )
})

export default Canvas