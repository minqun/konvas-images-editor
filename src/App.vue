<script setup>
import { onMounted, ref, nextTick } from 'vue';
import CanvasShowCase from './lib'
const canvasEle = ref()
const canvasEle2 = ref()

const dom= ref()
onMounted(async ()=> {
  await nextTick()
  console.log('mounted', dom.value)
  setTimeout(()=> {
    canvasEle.value = new CanvasShowCase({
      container: "#dom",
      width: 600,
      height: 600,
      img: 'https://cdn.shoplazza.com/b452f828e7d06f8b7d5fa2faa34a220b_750x.jpeg'
    })
    canvasEle2.value = new CanvasShowCase({
      container: "#dom2",
      width: 300,
      height: 300,
      img: 'https://cdn.shoplazza.com/b452f828e7d06f8b7d5fa2faa34a220b_750x.jpeg'
    })
  }, 1000)
})
const handleHot = () => {
    console.log(canvasEle.value)
    canvasEle.value.regionWindow()
  }
  const handlGetHot = () => {
    canvasEle.value.confirmRegion()
    let wd = canvasEle.value.getRegionWindow()
    let ratio = 300/600
    canvasEle2.value.setHotRegion({
      x: wd.x * ratio
      , y: wd.y *ratio,width: wd.width * ratio, height: wd.height * ratio
    })
  }
  const handlRmoveHot= () => {
    canvasEle.value.removeRegion()
    // console.log( canvasEle.value.removeRegion())
  }
  const handlText= () => {
    canvasEle.value.setText('我是添加的文本测试我是添加的文本测试我是添加的文本测试我是添加的文本测试我是添加的文本测试我是添加的文本测试', {
      fill: "#fff",
      fontSize: 18,

    })
    canvasEle2.value.setText('我是添加的文本测试我是添加的文本测试我是添加的文本测试我是添加的文本测试我是添加的文本测试我是添加的文本测试', {
      fill: "#fff",
      fontSize: 9,

    })
    
  }
  const handlFontText = () => {
    console.log( canvasEle.value.getTextsInfo(), canvasEle.value.getImagesInfo())
  }
  const handlSave= async  () => {
    const img = await canvasEle.value.saveToImage({pixelRatio: 2, mimeType :"image/png"})
    document.getElementById("imgBox").appendChild(img)
  }
  const handlSetBind = () => {
    canvasEle.value.setBindText(1)
    canvasEle.value.getTarget().text('123')
  }
  const handlCleanBind = () => {
    canvasEle.value.cacheBindText()
  }
  const handlimg = () => {
    canvasEle.value.setImageNode({
      url: 'https://cdn.shoplazza.com/2fc1f7cea537fd12102ff06890e5cc9b_180x.jpg'
    })
  }
 
</script>

<template>
  <div>
  <div style="background-color: #f1f1f1;  display: flex; align-items: center;justify-content: center;" id="dom">
  </div>
  <button @click="handleHot"> 加入热区</button>
  <button @click="handlGetHot"> 确定使用热区</button>
  <button @click="handlRmoveHot"> 移除热区</button>
  <button @click="handlText"> 加入区域文本</button>
  <button @click="handlFontText"> 获取文本/图片信息</button><br/>
  <button @click="handlCleanBind"> 取消所有文本绑定</button>
  <button @click="handlSetBind"> 文本目标(1)并修改</button>
  <button @click="handlimg"> 设置图片</button>
  <button @click="handlSave"> handlSave</button>
  <div id="imgBox"></div>
  <hr/>
  <div style="background-color: #f1f1f1; display: flex; align-items: center;justify-content: center;" id="dom2"></div>
  
    <button @click="handlText"> 加入区域文本</button>
</div>
</template>

<style scoped >

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
