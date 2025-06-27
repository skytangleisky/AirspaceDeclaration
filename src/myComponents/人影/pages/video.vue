<template>
  <video ref="videoRef" class="video" controls autoplay muted loop></video>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
const videoRef = ref()
import {所有站点的视频信息,m3u8} from '~/api/天工'
const item = defineModel('item',{
  default:{strName:"太平庄炮站"}
})

// let videoSrc = 'http://172.18.7.210:83/openUrl/vsigFGNO7le17fa52612afb457085fb8/live.m3u8';
let videoSrc = 'http://172.18.7.210:83/openUrl/vsigkAbJ5aUb5549f19ae7e402c8502f/live.m3u8';
onMounted(()=>{
  const video = videoRef.value
  所有站点的视频信息().then(({data})=>{
    for(let i=0;i<data.data.length;i++){
      const it = data.data[i]
      if(it.cameraName.includes(item.value.strName.substring(0,2))&&it.cameraName.includes('作业平台')){
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
  })
})
</script>
<style lang="scss" scoped>
.video{
  position: relative;
  width:100%;
}
</style>