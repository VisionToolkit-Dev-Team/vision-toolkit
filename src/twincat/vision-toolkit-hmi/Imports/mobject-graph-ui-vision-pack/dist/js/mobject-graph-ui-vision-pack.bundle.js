/**
 * MIT License
 *
 * Copyright (c) 2024 benhar-dev
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Third Party Licenses
 * --------------------
 *
 * MIT License
 * Copyright (c) 2020 Egor Nepomnyaschih
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('mobject-graph-ui')) :
  typeof define === 'function' && define.amd ? define(['exports', 'mobject-graph-ui'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MobjectGraphUiVisionPack = {}, global.MobjectGraphUi));
})(this, (function (exports, mobjectGraphUi) { 'use strict';

  /*
  MIT License
  Copyright (c) 2020 Egor Nepomnyaschih
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
  */

  const base64abc = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "/",
  ];

  function bytesToBase64(bytes) {
    let result = "",
      i,
      l = bytes.length;
    for (i = 2; i < l; i += 3) {
      result += base64abc[bytes[i - 2] >> 2];
      result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
      result += base64abc[((bytes[i - 1] & 0x0f) << 2) | (bytes[i] >> 6)];
      result += base64abc[bytes[i] & 0x3f];
    }
    if (i === l + 1) {
      // 1 octet yet to write
      result += base64abc[bytes[i - 2] >> 2];
      result += base64abc[(bytes[i - 2] & 0x03) << 4];
      result += "==";
    }
    if (i === l) {
      // 2 octets yet to write
      result += base64abc[bytes[i - 2] >> 2];
      result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
      result += base64abc[(bytes[i - 1] & 0x0f) << 2];
      result += "=";
    }
    return result;
  }

  /* Example of itcvnimage
  ---------------------------
  {
      imageInfo: {
          nImageSize: 75,
          nWidth: 5,
          nHeight: 5,
          nXPadding: 0,
          nYPadding: 0,
          stPixelFormat: {
              bSupported: true,
              bSigned: false,
              bPlanar: false,
              bFloat: false,
              nChannels: 3,
              ePixelEncoding: "TCVN_PE_NONE",
              ePixelPackMode: "TCVN_PPM_NONE",
              nElementSize: 8,
              nTotalSize: 24,
          },
      },
      imageData:
          "7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk",
  };
  */

  function loadITcVnImageToImage(itcvnimage, image) {
    if (!itcvnimage) {
      return;
    }
    const {
      imageInfo: { nWidth, nHeight, stPixelFormat },
      imageData,
    } = itcvnimage;

    // Convert base64 to binary data
    const binaryData = decodeBase64ToBinary(imageData);

    // Determine the correct bytes per pixel and channels
    const { nChannels, nElementSize } = stPixelFormat;

    // Process the binary data based on channel information
    const pixelArray = convertBinaryDataToPixelArray(
      binaryData,
      nWidth,
      nHeight,
      nChannels,
      nElementSize
    );

    // Create and draw the image on the canvas
    setImageUsingPixelArray(image, pixelArray, nWidth, nHeight);
  }

  function decodeBase64ToBinary(base64String) {
    const binaryString = window.atob(base64String);
    return new Uint8Array(
      binaryString.split("").map((char) => char.charCodeAt(0))
    );
  }

  function convertBinaryDataToPixelArray(
    binaryData,
    width,
    height,
    channels,
    bitDepth
  ) {
    const bytesPerPixel = (channels * bitDepth) / 8;
    const outputBytes = new Uint8Array(width * height * 4);
    let j = 0;

    for (let i = 0; i < binaryData.length; i += bytesPerPixel) {
      let r,
        g,
        b,
        a = 255;

      if (bitDepth === 8) {
        if (channels === 1) {
          r = g = b = binaryData[i];
        } else if (channels === 3) {
          r = binaryData[i];
          g = binaryData[i + 1];
          b = binaryData[i + 2];
        } else if (channels === 4) {
          r = binaryData[i];
          g = binaryData[i + 1];
          b = binaryData[i + 2];
          a = binaryData[i + 3];
        }
      } else if (bitDepth === 16) {
        if (channels === 1) {
          r = g = b = (binaryData[i] + binaryData[i + 1] * 256) >> 8;
        } else if (channels === 3) {
          r = (binaryData[i] + binaryData[i + 1] * 256) >> 8;
          g = (binaryData[i + 2] + binaryData[i + 3] * 256) >> 8;
          b = (binaryData[i + 4] + binaryData[i + 5] * 256) >> 8;
        } else if (channels === 4) {
          r = (binaryData[i] + binaryData[i + 1] * 256) >> 8;
          g = (binaryData[i + 2] + binaryData[i + 3] * 256) >> 8;
          b = (binaryData[i + 4] + binaryData[i + 5] * 256) >> 8;
          a = (binaryData[i + 6] + binaryData[i + 7] * 256) >> 8;
        }
      }

      outputBytes.set([r, g, b, a], j);
      j += 4;
    }

    return outputBytes;
  }

  function setImageUsingPixelArray(
    image,
    imagePixelArray,
    imageWidth,
    imageHeight
  ) {
    const canvas = createCanvas(imageWidth, imageHeight);
    const ctx = canvas.getContext("2d");

    const imageData = new ImageData(
      new Uint8ClampedArray(imagePixelArray),
      imageWidth,
      imageHeight
    );
    ctx.putImageData(imageData, 0, 0);

    image.src = canvas.toDataURL("image/png");
  }

  function createCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  function convertImageToITcVnImage(image) {
    const canvas = new OffscreenCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const itcvnimage = {
      imageInfo: {
        nImageSize: imageData.data.length,
        nWidth: canvas.width,
        nHeight: canvas.height,
        nXPadding: 0,
        nYPadding: 0,
        stPixelFormat: {
          bSupported: true,
          bSigned: false,
          bPlanar: false,
          bFloat: false,
          nChannels: 4,
          ePixelEncoding: "TCVN_PE_NONE",
          ePixelPackMode: "TCVN_PPM_NONE",
          nElementSize: 8,
          nTotalSize: 24,
        },
      },
      imageData: bytesToBase64(imageData.data),
    };

    // console.log("Serialized Image Data:", image);
    return itcvnimage;
  }

  class ITcVnImageDisplayWidget extends mobjectGraphUi.DisplayWidget {
    constructor(name, parent, options) {
      super(name, parent, options);
      this.image = new Image();

      this.on("valueChanged", (newValue, oldValue) => {
        if (newValue) {
          loadITcVnImageToImage(newValue, this.image);
        } else {
          this.image = new Image();
        }
      });
    }

    computeSize() {
      return new Float32Array([60, 60]);
    }

    draw(ctx, node, widget_width, y, H) {
      const margin = 5;
      const drawWidth = widget_width - margin * 2 + 1;
      const drawHeight = node.size[1] - margin - y;

      // draw the background
      ctx.fillStyle = "#303030";
      ctx.fillRect(margin, y, drawWidth, drawHeight);

      // create a rectangular clipping path
      ctx.beginPath();
      ctx.rect(margin, y, drawWidth, drawHeight);
      ctx.clip();

      // draw the checkerboard pattern
      let blockHeight = 10;
      let blockWidth = 10;
      let nRow = drawHeight / blockHeight;
      let nCol = drawWidth / blockWidth;

      ctx.beginPath();
      for (var i = 0; i < nRow; ++i) {
        for (var j = 0, col = nCol / 2; j < col; ++j) {
          ctx.rect(
            2 * j * blockWidth + (i % 2 ? 0 : blockWidth) + margin,
            i * blockHeight + y,
            blockWidth,
            blockHeight
          );
        }
      }
      ctx.fillStyle = "#303030";
      ctx.fill();

      // draw the outline
      ctx.strokeStyle = this.outline_color;
      ctx.strokeRect(margin, y, drawWidth, drawHeight);

      // draw the no image text
      if (this.image.src == "") {
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFFFFF"; //this.secondary_text_color;
        ctx.font = "italic 10pt Sans-serif";
        ctx.fillText("No image", widget_width * 0.5, y + drawHeight * 0.5);
        return;
      }

      // draw the image
      ctx.drawImage(this.image, margin, y, drawWidth, drawHeight);
    }
  }
  class ITcVnImageControlWidget extends mobjectGraphUi.ControlWidget {
    static SUPPORTED_TYPES = ["image/jpeg", "image/png", "image/bmp"];
    static DEFAULT_SIZE = new Float32Array([100, 100]);
    static OUTLINE_COLOR = "#000"; // default outline color
    static BACKGROUND_COLOR = "#303030";
    static TEXT_COLOR = "#FFF";

    constructor(name, property, parameter, content) {
      super(name, property, parameter, content);
      this.image = new Image();
      this._size = ITcVnImageControlWidget.DEFAULT_SIZE;
      this.value = this.getDefaultImageData();

      this.on("valueChanged", (newValue, oldValue) => {
        loadITcVnImageToImage(newValue, this.image);
      });
    }

    computeSize(width) {
      return this._size;
    }

    mouse(event, pos, node) {
      // Mouse interaction handling
    }

    draw(ctx, node, widget_width, y, H) {
      const margin = 5;
      const drawWidth = widget_width - 2 * margin;
      const drawHeight = node.size[1] - margin - y;

      this.drawBackground(ctx, margin, y, drawWidth, drawHeight);
      this.drawOutline(ctx, margin, y, drawWidth, drawHeight);

      // draw the no image text
      if (this.image.src == "") {
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "italic 10pt Sans-serif";
        ctx.fillText("Drag image here", widget_width * 0.5, y + drawHeight * 0.5);

        return;
      }

      // draw the image
      ctx.drawImage(this.image, margin, y, drawWidth, drawHeight);
    }

    onDropFile(file) {
      if (!this.isSupportedFileType(file)) {
        console.error("Unsupported file type:", file.type);
        return false;
      }

      const url = URL.createObjectURL(file);
      this.loadDroppedImageToWidget(url);
      return true;
    }

    isSupportedFileType(file) {
      return ITcVnImageControlWidget.SUPPORTED_TYPES.includes(file.type);
    }

    loadDroppedImageToWidget(url) {
      const image = new Image();
      image.src = url;
      image.onload = this.handleImageOnLoad.bind(this, image);
      image.onerror = () => {
        console.error(`Error loading the image: ${url}`);
        URL.revokeObjectURL(url);
      };
    }

    handleImageOnLoad(image) {
      this.setWidgetSizeToImage(image);
      this.value = convertImageToITcVnImage(image);
      URL.revokeObjectURL(image.src);
    }

    setWidgetSizeToImage(image) {
      let originalWidth = image.width;
      let originalHeight = image.height;
      let newHeight = 300;
      let aspectRatio = originalWidth / originalHeight;
      let newWidth = newHeight * aspectRatio;
      this._size = new Float32Array([newWidth, newHeight]);
      this.triggerParentResetSize();
    }

    drawBackground(ctx, margin, y, width, height) {
      ctx.fillStyle = ITcVnImageControlWidget.BACKGROUND_COLOR;
      ctx.fillRect(margin, y, width, height);
    }

    drawOutline(ctx, margin, y, width, height) {
      ctx.strokeStyle = ITcVnImageControlWidget.OUTLINE_COLOR;
      ctx.strokeRect(margin, y, width, height);
    }

    getDefaultImageData() {
      const image = {
        imageInfo: {
          nImageSize: 0,
          nWidth: 0,
          nHeight: 0,
          nXPadding: 0,
          nYPadding: 0,
          stPixelFormat: {
            bSupported: true,
            bSigned: false,
            bPlanar: false,
            bFloat: false,
            nChannels: 4,
            ePixelEncoding: "TCVN_PE_NONE",
            ePixelPackMode: "TCVN_PPM_NONE",
            nElementSize: 0,
            nTotalSize: 0,
          },
        },
        imageData: "",
      };
      return image;
    }
  }

  /* Example of data
  ---------------------------
  {
      imageInfo: {
          nImageSize: 75,
          nWidth: 5,
          nHeight: 5,
          nXPadding: 0,
          nYPadding: 0,
          stPixelFormat: {
              bSupported: true,
              bSigned: false,
              bPlanar: false,
              bFloat: false,
              nChannels: 3,
              ePixelEncoding: "TCVN_PE_NONE",
              ePixelPackMode: "TCVN_PPM_NONE",
              nElementSize: 8,
              nTotalSize: 24,
          },
      },
      imageData:
          "7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk",
  };
  */

  class VisionPack {
    install(graphFramework = new mobjectGraphUi.GraphFramework(), options) {
      this.registerWidgets(graphFramework, options);
      this.registerFileAssociation(graphFramework, options);
    }

    registerWidgets(graphFramework, options = {}) {
      graphFramework.registerWidgetType(
        ITcVnImageControlWidget,
        "INTERFACE",
        "ITcVnImage"
      );
      graphFramework.registerWidgetType(
        ITcVnImageDisplayWidget,
        "INTERFACE",
        "ITcVnImage"
      );
    }

    registerFileAssociation(graphFramework, options = {}) {
      graphFramework.registerFileAssociation(
        ["jpg", "png", "bmp"],
        "Literal/ITcVnImage",
        "value"
      );
    }
  }

  exports.VisionPack = VisionPack;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
