import { ref,watch } from 'vue'
const ThemeArray = ['dark', 'light', 'auto'] as const
type Theme = (typeof ThemeArray)[number]
const theme = ref<Theme>(localStorage.getItem('theme') as Theme || 'auto')
const match = matchMedia('(prefers-color-scheme: dark)')
function auto(){
  if(match.matches){
    ThemeArray.filter(item=>item!=='dark').forEach(item => document.documentElement.classList.remove(item))
    document.documentElement.classList.add('dark')
  }else{
    ThemeArray.filter(item=>item!=='light').forEach(item => document.documentElement.classList.remove(item))
    document.documentElement.classList.add('light')
  }
}
match.addEventListener('change',(e)=>{
  observer.disconnect()
  if(theme.value === 'auto'){
    auto()
  }
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
})
const observer = new MutationObserver((mutationsList) => {
  observer.disconnect()
  for (const mutation of mutationsList) {
    if (mutation.attributeName === 'class') {
      for(let j=0;j<ThemeArray.length;j++){
        for(let i=0;i<document.documentElement.classList.length;i++){
          if(document.documentElement.classList[i] === ThemeArray[j]){
            if(document.documentElement.classList[i] === 'auto'){
              theme.value = 'auto'
            }else{
              theme.value = ThemeArray[j]
            }
            break;
          }
        }
      }
    }
  }
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
});
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
watch(theme, (value) => {
  observer.disconnect()
  if(value === 'auto'){
    auto()
  }else{
    ThemeArray.filter(item=>item!==theme.value).forEach(item => document.documentElement.classList.remove(item))
    document.documentElement.classList.add(value)
  }
  localStorage.setItem('theme', value)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
},{
  immediate: true
})
window.addEventListener('storage', (event) => {
  observer.disconnect()
  if (event.key === 'theme') {
    if(ThemeArray.includes(event.newValue as Theme)){
      if(event.newValue === 'auto'){
        theme.value = 'auto'
        auto()
      }else{
        theme.value = event.newValue as Theme
        ThemeArray.filter(item=>item!==event.newValue).forEach(item => document.documentElement.classList.remove(item))
        document.documentElement.classList.add(event.newValue as Theme);
      }
    }else{
      auto()
    }
  }
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
});
export const useTheme = () => theme