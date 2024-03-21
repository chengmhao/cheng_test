import styled from "styled-components";


export const CanvasWrapper = styled.div`
  padding: 10px;
  text-align: center;
  .imgselect {
    width: 500px;
    margin: 10px auto;
    height: 50px;
    padding: 4px 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.10);
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 20px;
  }
  .pane {
    max-width: 1000px;
    background: #fff;
    padding: 20px 100px;
    margin: 10px auto;
    box-shadow: 0 4px 12px rgba(0,0,0,0.10);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    .canvas-box {
      width: 500px;
      height: 500px;
      flex: 3;
      box-sizing: border-box;
      border: 1px solid #333;
      border-radius: 10px;
      background: url(${require('../../assets/img/mosaic.jpg')}) center/cover;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #canvas {
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
    .tool {
      flex: 2;
      height: 500px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.10);
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      padding: 20px 0;
    }
  }

`
