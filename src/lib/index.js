import Konva from "konva";
class CanvasShowCase {
  constructor(props) {
    this.width = props.width || 500;
    this.height = props.height || 500;
    this.img = props.img;
    this.container = props.container;
    this.layerBox = [];
    this.hasRegion = false;
    this.imgNode = null;
    this.hasRegionInfo = null;
    this.cacheContral = [];
    this.stage = null;
    this.target = null;
    this.initRender();
  }
  /**
   * @description: 返回画布，konvas能力
   * @return {*}
   */
  getStage () {
    return this.stage
  }
  /**
   * @description: 初始化操作画布
   * @return {*}
   */
  async initRender() {
    this.stage = new Konva.Stage({
      container: this.container,
      width: this.width,
      height: this.height,
    });
    const layer = new Konva.Layer({
      name: "backgroud_layer",
      width: this.width,
      height: this.height,
    });
    this.addLayer("backgroud_layer", layer);
    // 添加背景
    this.imgNode = await this.addImageToLayer(
      "backgroud_layer",
      "bg-img",
      this.img,
      0,
      0
    );
    // 调整位置/大小
    if (this.width - this.imgNode.width() > 0) {
      this.imgNode.position({ x: (this.width - this.imgNode.width()) / 2 });
    } else {
      this.imgNode.position({ y: (this.height - this.imgNode.height()) / 2 });
    }

    // this.getLayer('backgroud_layer').size({ width:100, height: 100})
  }
  /**
   * @description: 添加图片到图层
   * @param {*} layerName
   * @param {*} imgName
   * @param {*} url
   * @param {*} x
   * @param {*} y
   * @param {*} w
   * @param {*} h
   * @return {*} promise
   */
  addImageToLayer(layerName, imgName, url, x, y, w, h) {
    const layer = this.getLayer(layerName);
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    return new Promise((resolve) => {
      img.onload = () => {
        console.log("img.width", img.width, "比较图片比例");
        const ratebgw = this.width / img.width;
        const ratebgh = this.height / img.height;
        let rate = img.width / img.height;
        if (rate > 1) {
          console.log("横向：", rate);
          rate = rate - 1;
        } else {
          console.log("纵向：", rate);
          rate = rate;
        }
        const kmg = new Konva.Image({
          x: x,
          y: y,
          name: imgName,
          image: img,
          width: w
            ? w
            : img.width / img.height > 1
            ? this.width
            : img.width * rate * ratebgw,
          height: h
            ? h
            : img.width / img.height > 1
            ? img.height * rate * ratebgh
            : this.height,
        });
        layer.add(kmg);
        console.log(
          "图标：：：",
          kmg.getAbsolutePosition(),
          kmg.width(),
          kmg.height()
        );
        resolve(kmg);
      };
    });
  }

  /**
   * @description: 添加层
   * @param {*} name 命名
   * @param {*} layer 层
   * @return {*} stage
   */
  addLayer(name, layer) {
    this.layerBox.push({
      name,
      layer,
    });
    this.stage.add(layer);
  }
  /**
   * @description: 获取层
   * @param {*} name
   * @return {*}
   */
  getLayer(name) {
    return this.layerBox.find((item) => item.name == name)?.layer || undefined;
  }
  /**
   * @description:   清理层
   * @param {*} name
   * @return {*}
   */
  removeLayer(name) {
    const i = this.layerBox.findIndex((item) => item.name == name);
    this.layerBox.splice(i, 1);
  }

  getCorner(pivotX, pivotY, diffX, diffY, angle) {
    // 计算以0为原点 水平和垂直方向之间距离
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);
    /// 角度
    angle += Math.atan2(diffY, diffX);

    // 获取变化后坐标x, y
    const x = pivotX + distance * Math.cos(angle);
    const y = pivotY + distance * Math.sin(angle);

    return { x: x, y: y };
  }
  getTotalBox(boxes) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    boxes.forEach((box) => {
      minX = Math.min(minX, box.x);
      minY = Math.min(minY, box.y);
      maxX = Math.max(maxX, box.x + box.width);
      maxY = Math.max(maxY, box.y + box.height);
    });
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }
  getClientRect(rotatedBox, child) {
    const { x, y, width, height } = rotatedBox;
    const rad = child ? child.rotation : rotatedBox.rotation;
    const p1 = this.getCorner(x, y, 0, 0, rad);
    const p2 = this.getCorner(x, y, width, 0, rad);
    const p3 = this.getCorner(x, y, width, height, rad);
    const p4 = this.getCorner(x, y, 0, height, rad);
    const minX = Math.min(p1.x, p2.x, p3.x, p4.x);
    const minY = Math.min(p1.y, p2.y, p3.y, p4.y);
    const maxX = Math.max(p1.x, p2.x, p3.x, p4.x);
    const maxY = Math.max(p1.y, p2.y, p3.y, p4.y);
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }
  getTotalBox(boxes) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    boxes.forEach((box) => {
      minX = Math.min(minX, box.x);
      minY = Math.min(minY, box.y);
      maxX = Math.max(maxX, box.x + box.width);
      maxY = Math.max(maxY, box.y + box.height);
    });
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }
  toFixed(n, limit = 3) {
    return n.toFixed(limit);
  }
  /**
   * @description: 产生热区
   * @return {*}
   */
  async regionWindow() {
    if (this.hasRegion) {
      console.log("热区不能重复添加！！");
      return;
    }
    const layer = new Konva.Layer({
      name: "region-layer",
      width: this.width,
      height: this.height,
    });
    const shape = new Konva.Rect({
      ...this.imgNode.position(),
      ...this.imgNode.size(),
      opacity: 0.1,
      fill: "red",
      draggable: true,
    });
    layer.add(shape);
    const tr = new Konva.Transformer({
      name: "region-window",
      nodes: [shape],
      boundBoxFunc: (oldBox, newBox) => {
        const box = this.getClientRect(newBox);
        console.log( this.toFixed(box.x) < this.toFixed(this.imgNode.x()) , this.toFixed(box.y) < this.toFixed(this.imgNode.y()))
        const isOut =
       this.toFixed(box.x) < this.toFixed(this.imgNode.x()) || this.toFixed(box.y) < this.toFixed(this.imgNode.y()) || this.toFixed(box.width + box.x) >
       this.toFixed(this.imgNode.width() + this.imgNode.position().x) ||
          this.toFixed(box.height + box.y) >
          this.toFixed(this.imgNode.height() + this.imgNode.position().y);
        if (isOut) {
          return oldBox;
        }
        return newBox;
      },
    });
    tr.on("dragmove", () => {
      const boxes = tr.nodes().map((node) => node.getClientRect());
      const box = this.getTotalBox(boxes);
      tr.nodes().forEach((shape) => {
        const absPos = shape.getAbsolutePosition();
        const newAbsPos = { ...absPos };
        if (box.x < this.imgNode.position().x - 2) {
          newAbsPos.x = this.imgNode.position().x;
        }
        if (box.y < this.imgNode.position().y - 2) {
          newAbsPos.y = this.imgNode.position().y;
        }
        if (
          box.x + box.width >
          this.imgNode.width() + this.imgNode.position().x
        ) {
          newAbsPos.x =
            this.imgNode.width() + this.imgNode.position().x - box.width;
        }
        if (
          box.y + box.height >
          this.imgNode.height() + this.imgNode.position().y
        ) {
          newAbsPos.y =
            this.imgNode.height() + this.imgNode.position().y - box.height;
        }
        shape.setAbsolutePosition(newAbsPos);
      });
    });
    layer.add(tr);
    this.addLayer("region-layer", layer);
    this.hasRegion = true;
  }
  /**
   * @description: 删除热区
   * @return {*}
   */
  removeRegion() {
    this.getLayer("region-layer").remove();
    this.removeLayer("region-layer");
    this.hasRegion = false;
    this.hasRegionInfo = null;
  }

  /**
   * @description: 获取热区信息
   * @return {x, y, width, height }
   */
  getRegionWindow() {
    this.hasRegionInfo = {
      x: this.stage.find(".region-window")[0]?.position().x,
      y: this.stage.find(".region-window")[0]?.position().y,
      width: this.stage.find(".region-window")[0]?.size()?.width,
      height: this.stage.find(".region-window")[0]?.size()?.height,
    };
    return this.hasRegionInfo;
  }
  /**
   * @description: 确认热区
   * @return {*} 热区信息
   */
  confirmRegion() {
    this.getRegionWindow();
    console.log("确定了区域", this.hasRegionInfo);
    this.getLayer("region-layer").opacity(0);
  }
  getTextsInfo() {
    const arr = this.stage.find(".text-transformer");
    return arr.map((item) => item.attrs);
  }
  getImagesInfo() {
    const arr = this.stage.find(".img-transformer");
    return arr.map((item) => item.attrs);
  }

  addTextNode(text, config) {
    const layer = new Konva.Layer({
      name: "text-layer",
    });
    const textSet = {
      name: "text-node",
      text,
      verticalAlign: "middle",
      align: "center",
      draggable: true,
      x:
        this.imgNode.x() +
        (this.imgNode.width() / 2 - this.imgNode.width() / 4),
      y:
        this.imgNode.y() +
        (this.imgNode.height() / 2 - this.imgNode.height() / 4),
      height: this.imgNode.height() / 2,
      width: this.imgNode.width() / 2,
      ...config,
    };
    let rect = null;
    if (this.hasRegion && this.hasRegionInfo) {
      rect = new Konva.Rect({
        ...this.hasRegionInfo,
        opacity: 0,
        fill: "red",
        draggable: false,
        name: "mask-region",
      });
      layer.add(rect);
      (textSet.x =
        this.hasRegionInfo.x +
        (this.hasRegionInfo.width / 2 - this.hasRegionInfo.width / 4)),
        (textSet.y =
          this.hasRegionInfo.y +
          (this.hasRegionInfo.height / 2 - this.hasRegionInfo.height / 4));
      textSet.width = this.hasRegionInfo.width / 2;
      textSet.height = this.hasRegionInfo.height / 2;
    }
    var textNode = new Konva.Text(textSet);
    layer.add(textNode);
    const textTranformer = new Konva.Transformer({
      name: "text-transformer",
      nodes: [textNode],
      boundBoxFunc: (oldBox, newBox) => {
        const box = this.getClientRect(newBox);
        let isOut = false;
        isOut =
          this.toFixed(box.width + box.x) >
          this.toFixed(this.imgNode.width() + this.imgNode.position().x) ||
          this.toFixed(box.height + box.y) >
          this.toFixed(this.imgNode.height() + this.imgNode.position().y);
        if (this.hasRegion) {
          isOut =
            this.toFixed(box.width + box.x) >
            this.toFixed(this.hasRegionInfo.width +
                this.hasRegionInfo.x -
                this.imgNode.x()) ||
            this.toFixed(box.height + box.y) >
            this.toFixed(this.hasRegionInfo.height +
                this.hasRegionInfo.y -
                this.imgNode.y());
        }
        if (isOut) {
          return oldBox;
        }
        return newBox;
      },
    });
    textTranformer.resizeEnabled(false);
    textTranformer.on("dragend", () => {
      rect && rect.opacity(0);
    });
    textTranformer.on("dragmove", () => {
      rect && rect.opacity(0.1);
      const boxes = textTranformer.nodes().map((node) => node.getClientRect());
      const box = this.getTotalBox(boxes);
      textTranformer.nodes().forEach((shape) => {
        const absPos = shape.getAbsolutePosition();
        const newAbsPos = { ...absPos };
        if (this.hasRegion) {
          if (box.x < this.hasRegionInfo.x - 2) {
            newAbsPos.x = this.hasRegionInfo.x;
          }
          if (box.y < this.hasRegionInfo.y - 2) {
            newAbsPos.y = this.hasRegionInfo.y;
          }
          if (
            box.x + box.width >
            this.hasRegionInfo.width + this.hasRegionInfo.x
          ) {
            newAbsPos.x =
              this.hasRegionInfo.width + this.hasRegionInfo.x - box.width;
          }
          if (
            box.y + box.height >
            this.hasRegionInfo.height + this.hasRegionInfo.y
          ) {
            newAbsPos.y =
              this.hasRegionInfo.height + this.hasRegionInfo.y - box.height;
          }
        } else {
          if (box.x < this.imgNode.position().x - 2) {
            newAbsPos.x = this.imgNode.position().x;
          }
          if (box.y < this.imgNode.position().y - 2) {
            newAbsPos.y = this.imgNode.position().y;
          }
          if (
            box.x + box.width >
            this.imgNode.width() + this.imgNode.position().x
          ) {
            newAbsPos.x =
              this.imgNode.width() + this.imgNode.position().x - box.width;
          }
          if (
            box.y + box.height >
            this.imgNode.height() + this.imgNode.position().y
          ) {
            newAbsPos.y =
              this.imgNode.height() + this.imgNode.position().y - box.height;
          }
        }

        shape.setAbsolutePosition(newAbsPos);
      });
    });
    layer.add(textTranformer);
    this.addLayer("text-layer", layer);
    this.target = layer;
    // console.log(layer.setZIndex(0), 'layer.setZIndex()')
  }
  addImageNode(obj) {
    const { url, x, y, w,h } = obj
    const layer = new Konva.Layer({
      name: "img-layer",
    });
   
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    return new Promise((resolve) => {
      img.onload = () => {
        const imgSet = {
            x: x
              ? x
              : this.imgNode.x() +
                (this.imgNode.width() / 2 - this.imgNode.width() / 4),
            y: y
              ? y
              : this.imgNode.y() +
                (this.imgNode.height() / 2 - this.imgNode.height() / 4),
            name: "img-node",
            draggable: true,
            image: img,
            height: w ? w : this.imgNode.height() / 2,
            width: h ? h : this.imgNode.width() / 2,
          }
       
        let rect = null;
        if (this.hasRegion && this.hasRegionInfo) {
          rect = new Konva.Rect({
            ...this.hasRegionInfo,
            opacity: 0,
            fill: "red",
            draggable: false,
            name: "mask-img",
          });
          layer.add(rect);
          (imgSet.x = x ? x :
            this.hasRegionInfo.x +
            (this.hasRegionInfo.width / 2 - this.hasRegionInfo.width / 4)),
            (imgSet.y = y ? y :
              this.hasRegionInfo.y +
              (this.hasRegionInfo.height / 2 - this.hasRegionInfo.height / 4));
              imgSet.width = w ? w : this.hasRegionInfo.width / 2;
              imgSet.height = h ? h : this.hasRegionInfo.height / 2;
        }
        const kmg = new Konva.Image(imgSet);
        layer.add(kmg);
        const imgTranformer = new Konva.Transformer({
          name: "img-transformer",
          nodes: [kmg],
          boundBoxFunc: (oldBox, newBox) => {
            const box = this.getClientRect(newBox);
            let isOut = false;
            console.log(box, 'box', this.imgNode.width(), this.imgNode.position().x)
            isOut =
            this.toFixed(box.x) < this.toFixed(this.imgNode.position().x) || this.toFixed(box.y) < (this.imgNode.position().y) ||   this.toFixed(box.width + box.x) >
            this.toFixed(this.imgNode.width() + this.imgNode.position().x) ||
              this.toFixed(box.height + box.y) >
              this.toFixed(this.imgNode.height() + this.imgNode.position().y);
            if (this.hasRegion) {
              isOut =
              this.toFixed(box.x) <  this.toFixed(this.hasRegionInfo.x) || this.toFixed(box.y) <  this.toFixed(this.hasRegionInfo.y) || this.toFixed(box.width + box.x) >
              this.toFixed(this.hasRegionInfo.width +
                    this.hasRegionInfo.x -
                    this.imgNode.x()) ||
                this.toFixed(box.height + box.y) >
                this.toFixed( this.hasRegionInfo.height +
                    this.hasRegionInfo.y -
                    this.imgNode.y());
            }
            if (isOut) {
              return oldBox;
            }
            return newBox;
          },
        });
        imgTranformer.resizeEnabled(true);
        imgTranformer.on("dragend", () => {
          rect && rect.opacity(0);
        });
        imgTranformer.on("dragmove", () => {
          rect && rect.opacity(0.1);
          const boxes = imgTranformer
            .nodes()
            .map((node) => node.getClientRect());
          const box = this.getTotalBox(boxes);
          imgTranformer.nodes().forEach((shape) => {
            const absPos = shape.getAbsolutePosition();
            const newAbsPos = { ...absPos };
            if (this.hasRegion) {
              if (box.x < this.hasRegionInfo.x - 2) {
                newAbsPos.x = this.hasRegionInfo.x;
              }
              if (box.y < this.hasRegionInfo.y - 2) {
                newAbsPos.y = this.hasRegionInfo.y;
              }
              if (
                box.x + box.width >
                this.hasRegionInfo.width + this.hasRegionInfo.x
              ) {
                newAbsPos.x =
                  this.hasRegionInfo.width + this.hasRegionInfo.x - box.width;
              }
              if (
                box.y + box.height >
                this.hasRegionInfo.height + this.hasRegionInfo.y
              ) {
                newAbsPos.y =
                  this.hasRegionInfo.height + this.hasRegionInfo.y - box.height;
              }
            } else {
              if (box.x < this.imgNode.position().x - 2) {
                newAbsPos.x = this.imgNode.position().x;
              }
              if (box.y < this.imgNode.position().y - 2) {
                newAbsPos.y = this.imgNode.position().y;
              }
              if (
                box.x + box.width >
                this.imgNode.width() + this.imgNode.position().x
              ) {
                newAbsPos.x =
                  this.imgNode.width() + this.imgNode.position().x - box.width;
              }
              if (
                box.y + box.height >
                this.imgNode.height() + this.imgNode.position().y
              ) {
                newAbsPos.y =
                  this.imgNode.height() +
                  this.imgNode.position().y -
                  box.height;
              }
            }

            shape.setAbsolutePosition(newAbsPos);
          });
        });
        layer.add(imgTranformer);
        this.addLayer("img-layer", layer);
        this.target = layer;
        resolve(kmg);
      };
    });
  }
  // 不知道干嘛用呢
  // addImageGroupNode(obj) {
  //   const { url, x, y, w,h } = obj
  //   const layer = new Konva.Layer({
  //     name: "img-layer",
  //   });
   
  //   const img = new Image();
  //   img.crossOrigin = "Anonymous";
  //   img.src = url;
  //   return new Promise((resolve) => {
  //     img.onload = () => {
  //       const defaultSet = {
  //         x: x
  //         ? x
  //         : this.imgNode.x() +
  //           (this.imgNode.width() / 2 - this.imgNode.width() / 4),
  //       y: y
  //         ? y
  //         : this.imgNode.y() +
  //           (this.imgNode.height() / 2 - this.imgNode.height() / 4),
  //       height: w ? w : this.imgNode.height() / 2,
  //       width: h ? h : this.imgNode.width() / 2,
  //       }
  //       const imgSet = {
  //           ...defaultSet,
  //           name: "img-node",
  //           draggable: false,
  //           image: img,
  //       }
  //       const rectImage = {
  //         ...defaultSet,
  //         name: "img-node-mask",
  //         draggable: true,
  //         opacity: 0.1,
  //         fill: "green"
  //       }
       
  //       let rect = null;
  //       if (this.hasRegion && this.hasRegionInfo) {
  //         rect = new Konva.Rect({
  //           ...this.hasRegionInfo,
  //           opacity: 0,
  //           fill: "red",
  //           draggable: false,
  //           name: "mask-img",
  //         });
  //         layer.add(rect);
  //         (imgSet.x = x ? x :
  //           this.hasRegionInfo.x +
  //           (this.hasRegionInfo.width / 2 - this.hasRegionInfo.width / 4)),
  //           (imgSet.y = y ? y :
  //             this.hasRegionInfo.y +
  //             (this.hasRegionInfo.height / 2 - this.hasRegionInfo.height / 4));
  //             imgSet.width = w ? w : this.hasRegionInfo.width / 2;
  //             imgSet.height = h ? h : this.hasRegionInfo.height / 2;
  //           (rectImage.x = x ? x :
  //             this.hasRegionInfo.x +
  //             (this.hasRegionInfo.width / 2 - this.hasRegionInfo.width / 4)),
  //             (rectImage.y = y ? y :
  //               this.hasRegionInfo.y +
  //               (this.hasRegionInfo.height / 2 - this.hasRegionInfo.height / 4));
  //               rectImage.width = w ? w : this.hasRegionInfo.width / 2;
  //               rectImage.height = h ? h : this.hasRegionInfo.height / 2;
  //       }
  //       const kmg = new Konva.Image(imgSet);
  //       const rectImageBox = new Konva.Rect(rectImage);
  //       layer.add(rectImageBox);
  //       layer.add(kmg);
  //       const imgTranformer = new Konva.Transformer({
  //         name: "img-transformer",
  //         nodes: [rectImageBox],
  //         boundBoxFunc: (oldBox, newBox) => {
  //           const box = this.getClientRect(newBox);
  //           let isOut = false;
  //           isOut =
  //           this.toFixed(box.x) < this.toFixed(this.imgNode.position().x) || this.toFixed(box.y) < (this.imgNode.position().y) ||   this.toFixed(box.width + box.x) >
  //           this.toFixed(this.imgNode.width() + this.imgNode.position().x) ||
  //             this.toFixed(box.height + box.y) >
  //             this.toFixed(this.imgNode.height() + this.imgNode.position().y);
  //           if (this.hasRegion) {
  //             isOut =
  //             this.toFixed(box.x) <  this.toFixed(this.hasRegionInfo.x) || this.toFixed(box.y) <  this.toFixed(this.hasRegionInfo.y) || this.toFixed(box.width + box.x) >
  //             this.toFixed(this.hasRegionInfo.width +
  //                   this.hasRegionInfo.x -
  //                   this.imgNode.x()) ||
  //               this.toFixed(box.height + box.y) >
  //               this.toFixed( this.hasRegionInfo.height +
  //                   this.hasRegionInfo.y -
  //                   this.imgNode.y());
  //           }
  //           if (isOut) {
  //             return oldBox;
  //           }
  //           return newBox;
  //         },
  //       });
  //       // imgTranformer.resizeEnabled(false);
  //       imgTranformer.on("dragend", () => {
  //         rect && rect.opacity(0);
  //       });
        
  //       imgTranformer.on("dragmove", () => {
  //         rect && rect.opacity(0.1);
  //         const boxes = imgTranformer
  //           .nodes()
  //           .map((node) => node.getClientRect());
  //         const box = this.getTotalBox(boxes);
          
  //         imgTranformer.nodes().forEach((shape) => {
  //           console.log(shape, ';shape')
  //           const absPos = shape.getAbsolutePosition();
  //           const newAbsPos = { ...absPos };
  //           if (this.hasRegion) {
  //             if (box.x < this.hasRegionInfo.x - 2) {
  //               newAbsPos.x = this.hasRegionInfo.x;
  //             }
  //             if (box.y < this.hasRegionInfo.y - 2) {
  //               newAbsPos.y = this.hasRegionInfo.y;
  //             }
  //             if (
  //               box.x + box.width >
  //               this.hasRegionInfo.width + this.hasRegionInfo.x
  //             ) {
  //               newAbsPos.x =
  //                 this.hasRegionInfo.width + this.hasRegionInfo.x - box.width;
  //             }
  //             if (
  //               box.y + box.height >
  //               this.hasRegionInfo.height + this.hasRegionInfo.y
  //             ) {
  //               newAbsPos.y =
  //                 this.hasRegionInfo.height + this.hasRegionInfo.y - box.height;
  //             }
  //           } else {
  //             if (box.x < this.imgNode.position().x - 2) {
  //               newAbsPos.x = this.imgNode.position().x;
  //             }
  //             if (box.y < this.imgNode.position().y - 2) {
  //               newAbsPos.y = this.imgNode.position().y;
  //             }
  //             if (
  //               box.x + box.width >
  //               this.imgNode.width() + this.imgNode.position().x
  //             ) {
  //               newAbsPos.x =
  //                 this.imgNode.width() + this.imgNode.position().x - box.width;
  //             }
  //             if (
  //               box.y + box.height >
  //               this.imgNode.height() + this.imgNode.position().y
  //             ) {
  //               newAbsPos.y =
  //                 this.imgNode.height() +
  //                 this.imgNode.position().y -
  //                 box.height;
  //             }
  //           }
          
  //           shape.setAbsolutePosition(newAbsPos);
  //         });
  //       });
  //       layer.add(imgTranformer);
  //       this.addLayer("img-layer", layer);
  //       this.target = layer;
  //       resolve(kmg);
  //     };
  //   });
  // }

  /**
   * @description: 取消所有文本可移动
   * @param {*} index
   * @return {*}
   */
  cacheBindText() {
    this.stage.find(".text-transformer").forEach((item) => {
      item.nodes([]);
    });
    this.stage.find(".text-node").forEach((item) => {
      item.draggable(false);
    });
  }

  /**
   * @description: 获取操作目标
   * @return {*}
   */
  getTarget() {
    return this.target;
  }
  /**
   * @description: 设置文本目标
   * @param {*} index
   * @return {*}
   */
  setBindText(index) {
    this.stage.find(".text-transformer").forEach((item, i) => {
      if (i == index) {
        this.stage.find(".text-node")[index].draggable(true);
        item.nodes([this.stage.find(".text-node")[index]]);
        this.target = this.stage.find(".text-node")[index];
      }
    });
  }

  /**
   * @description: 设置文本
   * @param {*} text 内容
   * @param {*} config konvas 文本设置
   * @return {*}
   */
  setText(text, config) {
    this.addTextNode(text, config);
  }
  /**
   * @description: 设置图片
   * @param {*} obj { url , x ,y ,w, h}
   * @return {*}
   */
  setImageNode (obj) {
    return this.addImageNode(obj)
  }

  /**
   * @description: 设置热区
   * @param {*} obj { x, y, width, height }
   * @return {*}
   */
  setHotRegion(obj) {
    this.hasRegion = true;
    this.hasRegionInfo = obj;
  }

  /**
   * @description: 保存图片
   * @param {*} obj { pixelRatio: 2, mimeType :"image/png", quality: 1 }
   * @return {*} Promise<Image>
   */
  saveToImage(obj) {
    const txtCache = [];
    const imgCache = [];
    this.stage.find(".text-transformer").forEach((item, i) => {
      txtCache.push(item.nodes());
      item.nodes([]);
    });
    this.stage.find(".img-transformer").forEach((item, i) => {
        imgCache.push(item.nodes());
        item.nodes([]);
    });
    let _this = this;
    return new Promise((resolve) => {
      this.stage.toImage({
        ...this.imgNode.position(),
        ...this.imgNode.size(),
        ...obj,
        callback(img) {
          img.width = _this.imgNode.width();
          _this.stage.find(".text-transformer").forEach((item, i) => {
            item.nodes(txtCache[i]);
          });
          _this.stage.find(".img-transformer").forEach((item, i) => {
            item.nodes(imgCache[i]);
          });
          resolve(img);
        },
      });
    });
  }
}

export default CanvasShowCase;
