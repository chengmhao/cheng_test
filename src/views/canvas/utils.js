/**
 * 获取选中框的8个点
 * @param x 
 * @param y 
 * @param w 
 * @param h 
 */
export const getDotPosition = (x, y, w, h) => {
  return [
    [x - 2, y - 2, 4, 4],
    [x + w / 2 - 2, y - 2, 4, 4],
    [x + w - 2, y - 2, 4, 4],
    [x - 2, y + h / 2 - 2, 4, 4],
    [x + w - 2, y + h / 2 - 2, 4, 4],
    [x - 2, y + h - 2, 4, 4],
    [x + w / 2 - 2, y + h - 2, 4, 4],
    [x + w - 2, y + h - 2, 4, 4],
  ];
};

/**
 * 获取选中框的虚线
 * @param x 
 * @param y 
 * @param w 
 * @param h 
 */
export const getDashPosition = (x, y, w, h) => {
  return [
    [x, y + h / 3, x + w, y + h / 3],
    [x, y + 2 * h / 3, x + w, y + 2 * h / 3],
    [x + w / 3, y, x + w / 3, y + h],
    [x + 2 * w / 3, y, x + 2 * w / 3, y + h]
  ];
};

// 边界点位置
export const getMousePosi = (x, y, w, h) => {
  return [
    // 左上 右上 右下 左下 四个点
    [x - 4, y - 4, 8, 8],
    [x + w - 4, y - 4, 8, 8],
    [x + w - 4, y + h - 4, 8, 8],
    [x - 4, y + h - 4, 8, 8],
    // 上 右 下 左 四条边
    [x - 4, y - 4, w + 4, 8],
    [x + w - 4, y - 4, 8, h + 4],
    [x - 4, y + h - 4, w + 4, 8],
    [x - 4, y - 4, 8, h + 4]
  ]
};

// 边界类型
export const getCursorStyle = (i) => {
  let cursor = 'default';
  // 0 左上 1右上 2右下 3左下 4上 5右 6下 7左
  // n 北 s 南 e 东 w 西
  switch (i) {
    case 0:
    case 2: cursor = 'nwse-resize'; break;
    case 1:
    case 3: cursor = 'nesw-resize'; break;
    case 4:
    case 6: cursor = 'ns-resize'; break;
    case 5:
    case 7: cursor = 'ew-resize'; break;
    case 8: cursor = 'move'; break;
    default: break;
  };
  return cursor;
};

// 操做不通边界类型
export const handleMouseInfo = (i, select, distance) => {
  const _select = { ...select };
  switch (i) {
    case 0:
      _select.x += distance.x;
      _select.y += distance.y;
      _select.w -= distance.x;
      _select.h -= distance.y;
      break;
    case 1:
      _select.y += distance.y;
      _select.w += distance.x;
      _select.h -= distance.y;
      break;
    case 2:
      _select.w += distance.x;
      _select.h += distance.y;
      break;
    case 3:
      _select.x += distance.x;
      _select.w -= distance.x;
      _select.h += distance.y;
      break;
    case 4:
      _select.y += distance.y;
      _select.h -= distance.y;
      break;
    case 5:
      _select.w += distance.x;
      break;
    case 6:
      _select.h += distance.y;
      break;
    case 7:
      _select.x += distance.x;
      _select.w -= distance.x;
      break;
    case 8:
      _select.x += distance.x;
      _select.y += distance.y;
      break;
    default: break;
  };

  return _select;
};

/**
 * 判断选中框是否到外界了，返回选中框新位置
 * @param w 
 * @param h 
 * @param select 
 */
export const checkSelectBoundary = (w, h, select) => {
  // 只需要判断左上角和右下角
  const _select = { ...select };

  _select.x < 0 && (_select.x = 0); // 左边界
  _select.y < 0 && (_select.y = 0); // 上边界

  _select.x + _select.w > w && (_select.x -= _select.x + _select.w - w); // 右边界
  _select.y + _select.h > h && (_select.y -= _select.y + _select.h - h);

  return _select;
};

// 灰度
export const getGrayscaleData = (imgData) => {
  const data = imgData.data;
  console.log(data.slice(0, 3), "cdabkjvnds")
  for (let i = 0; i < data.length; i += 4) {
    const grayscale = (data[i] + data[i + 1] * 2 + data[i + 2]) >> 2;
    data[i] = grayscale;
    data[i + 1] = grayscale;
    data[i + 2] = grayscale;
  };
  console.log(data.slice(0, 3), "cdabkjvnds")
  return data;
};

export const getPhotoData = ({ imgSize, rotate, img, canvasSize, imgScale, selectPosi, grayscale }) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  let { width: imgWidth, height: imgHeight } = imgSize;

  if (rotate % 180 !== 0) {
    [imgWidth, imgHeight] = [imgHeight, imgWidth];
  };

  canvas.width = imgWidth;
  canvas.height = imgHeight;

  ctx.save();
  ctx.translate(imgWidth / 2, imgHeight / 2);
  ctx.rotate(Math.PI / 180 * rotate);
  if (rotate % 180 !== 0) {
    [imgWidth, imgHeight] = [imgHeight, imgWidth];
  };
  ctx.translate(-imgWidth / 2, - imgHeight / 2);
  ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
  ctx.restore();

  let { width: canvasWidth, height: canvasHeight } = canvasSize;

  if (rotate % 180 !== 0) {
    [imgWidth, imgHeight] = [imgHeight, imgWidth];
  };

  const putX = (((imgWidth - canvasWidth / imgScale) / 2) + selectPosi.x / imgScale);
  const putY = (((imgHeight - canvasHeight / imgScale) / 2) + selectPosi.y / imgScale);
  const putW = selectPosi.w / imgScale;
  const putH = selectPosi.h / imgScale;

  if (!putW || !putH) {
    return '';
  };

  const imgData = ctx.getImageData(putX, putY, putW, putH);

  if (grayscale) {
    getGrayscaleData(imgData);
  };

  canvas.width = putW;
  canvas.height = putH;

  ctx.putImageData(imgData, 0, 0);

  return new Promise(res => {
    canvas.toBlob(e => res(e));
  })
};

export const getAnewXY = (select) => {
  return {
    x: select.x + (select.w < 0 ? select.w : 0),
    y: select.y + (select.h < 0 ? select.h : 0),
    w: Math.abs(select.w),
    h: Math.abs(select.h)
  };
};