<template>
  <div class="video-container">
    <video ref="videoRef" class="video" controls autoplay muted loop></video>
    <div class="close-btn" @click="item.visible=false"><el-icon v-html="closeUrl"></el-icon></div>
  </div>
</template>
<script setup lang="ts">
import closeUrl from '~/assets/close.svg?raw'
import { onMounted, ref } from 'vue';
const videoRef = ref()
import {所有站点的视频信息,m3u8} from '~/api/天工'
const item = defineModel('item',{
  default:{strName:"太平庄炮站"}
})

let videoSrc = 'http://172.18.7.210:83/openUrl/vsigkAbJ5aUb5549f19ae7e402c8502f/live.m3u8';
onMounted(()=>{
  const video = videoRef.value
  所有站点的视频信息().then(({data})=>{
    let has = false
    for(let i=0;i<data.data.length;i++){
      const it = data.data[i]
      if(it.cameraName.includes(item.value.strName.substring(0,2))&&it.cameraName.includes('作业平台')){
        has = true
        m3u8(it.cameraIndexCode).then(res=>{
          const url = new URL(res.data.data.url)
          videoSrc = url.pathname + url.search
          console.log(videoSrc)
          if (Hls.isSupported()) {
            const hls = new Hls()
            hls.loadSource(videoSrc)
            hls.attachMedia(video)
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              video.play()
            })
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoSrc
            video.addEventListener('loadedmetadata', () => {
              video.play()
            })
          } else {
            alert('该浏览器不支持 HLS 播放')
          }
        })
        break
      }
    }
    if(!has){
      console.log(`${item.value.strName}无视频流数据!`)
    }
  })
})
</script>
<style lang="scss" scoped>
.video-container{
  position: relative;
  .video{
    position: relative;
    width:100%;
  }
  .close-btn {
    right:10px;
    top:10px;
    position: absolute;
    width:20px;
    height:20px;
    justify-content: center;
    align-items:center;
    font-size: 0.16rem;
    z-index:999;
    color:white;
    display: none;
    &:hover {
      .el-icon {
          color: #ff4d4f;
      }
    }
    &:active {
      transform: rotateX(180deg);
      transition: transform 0.3s;
      transition-timing-function: ease-in-out;
      .el-icon {
          color: #d32f2f;
      }
    }
  }
  &:hover{
    .close-btn{
      display: flex;
    }
  }
}
</style>