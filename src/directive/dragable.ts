// localStorage.setItem('z-index','1')
import { gsap, Power0, Power1, Power2, Power3, Power4 } from 'gsap'
export default {
  beforeMount(el:any, binding:any, vnode:any, oldVnode:any) {
    let obj:any
    const mousemoveFunc = (event:any) => {
      var ev = event || window.event
      posl = { x: ev.clientX, y: ev.clientY }
      var x = posl.x - pos.x; var y = posl.y - pos.y
      pos = JSON.parse(JSON.stringify(posl))
      obj.targetLeft += x
      obj.targetTop += y
      obj.targetRight -= x
      obj.targetBottom -= y
      let rect = el.getBoundingClientRect()
      gsap.to(obj, {
        duration: 1,
        left: obj.targetLeft,
        top: obj.targetTop,
        right: obj.targetRight,
        bottom: obj.targetBottom,
        onUpdate: () => {
          if(el.parentNode){
            if(el.hasAttribute('right')){
              if(obj.right < el.parentNode.scrollLeft + el.parentNode.clientWidth - el.parentNode.scrollWidth){
                obj.right = el.parentNode.scrollLeft + el.parentNode.clientWidth - el.parentNode.scrollWidth
              }
              if(obj.right > el.parentNode.scrollLeft + el.parentNode.clientWidth - rect.width){
                obj.right = el.parentNode.scrollLeft + el.parentNode.clientWidth - rect.width
              }
              el.style.right = obj.right - el.parentNode.scrollLeft + 'px'
            }else{
              if(obj.left < - el.parentNode.scrollLeft){
                obj.left = - el.parentNode.scrollLeft
              }
              if(obj.left > - el.parentNode.scrollLeft + el.parentNode.scrollWidth - rect.width){
                obj.left = - el.parentNode.scrollLeft + el.parentNode.scrollWidth - rect.width
              }
              el.style.left = obj.left + el.parentNode.scrollLeft + 'px'
            }
            if(el.hasAttribute('bottom')){
              if(obj.bottom < el.parentNode.scrollTop + el.parentNode.clientHeight - el.parentNode.scrollHeight){
                obj.bottom = el.parentNode.scrollTop + el.parentNode.clientHeight - el.parentNode.scrollHeight
              }
              if(obj.bottom > el.parentNode.scrollTop + el.parentNode.clientHeight - rect.height){
                obj.bottom = el.parentNode.scrollTop + el.parentNode.clientHeight - rect.height
              }
              el.style.bottom = obj.bottom - el.parentNode.scrollTop + 'px'
            }else{
              if(obj.top < - el.parentNode.scrollTop){
                obj.top = - el.parentNode.scrollTop
              }
              if(obj.top > - el.parentNode.scrollTop + el.parentNode.scrollHeight - rect.height){
                obj.top = - el.parentNode.scrollTop + el.parentNode.scrollHeight - rect.height
              }
              el.style.top = obj.top + el.parentNode.scrollTop + 'px'
            }
          }
        },
        ease: Power4.easeOut
      })
      // el.style.cursor = 'move'
    }
    const mouseupFunc = function() {
      document.removeEventListener('mousemove', mousemoveFunc)
      document.removeEventListener('mouseup', mouseupFunc)
      // el.style.cursor = 'default'
    }
    var pos:any, posl:any
    el.addEventListener('mousedown', (event:any) => {
      // let z = localStorage.getItem('z-index')
      // el.style['z-index']=z
      // localStorage.setItem('z-index',(Number(z)+1).toString())
      var ev = event || window.event
      event.stopPropagation()
      let rect = el.getBoundingClientRect()
      let rectParent = el.parentNode.getBoundingClientRect()
      el.style.pointerEvents = 'none'
      el.style.userSelect = 'none'
      const mask = document.createElement('div')
      mask.style.position = 'absolute'
      mask.style.left = '0'
      mask.style.top = '0'
      mask.style.width = '100%'
      mask.style.height = '100%'
      mask.style.backgroundColor = 'rgba(0,0,0,0)'
      mask.style.zIndex = '9999'
      mask.style.cursor = 'move'
      document.body.appendChild(mask)
      //浏览器窗口内区域通过mask来控制移动（注意不要影响mask下其他元素），超出部分通过document移动
      mask.onmousemove = (event:any) => {
        event.stopPropagation()
        mousemoveFunc(event)
      }
      obj = {
        targetLeft: rect.left-rectParent.left,
        targetTop: rect.top-rectParent.top,
        left: rect.left-rectParent.left,
        top: rect.top-rectParent.top,
        targetRight:rectParent.width - rect.right+rectParent.left,
        targetBottom: rectParent.height - rect.bottom+rectParent.top,
        right:rectParent.width - rect.right+rectParent.left,
        bottom:rectParent.height - rect.bottom+rectParent.top
      }
      pos = { x: ev.clientX, y: ev.clientY }
      document.addEventListener('mousemove', mousemoveFunc,{passive:true})
      document.addEventListener('mouseup', ()=>{
        el.style.pointerEvents = 'auto'
        mouseupFunc()
        mask.remove()
      },{passive:true})
    },{passive:true})
  }
}