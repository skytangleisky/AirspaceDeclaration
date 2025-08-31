import { ref,watch,computed } from 'vue'
const ThemeArray = ['dark', 'light', 'auto'] as const
type Theme = (typeof ThemeArray)[number]
let defaultTheme:Theme = 'auto'
const _isDark = ref(false)
for(let i=0;i<document.documentElement.classList.length;i++){
  if(ThemeArray.includes(document.documentElement.classList[i] as Theme)){
    defaultTheme = document.documentElement.classList[i] as Theme
    break;
  }
}
const theme = ref<Theme>(localStorage.getItem('theme') as Theme || defaultTheme)
const match = matchMedia('(prefers-color-scheme: dark)')
if(theme.value === 'auto'){
  auto()
}else{
  ThemeArray.filter(item=>item!==theme.value).forEach(item => document.documentElement.classList.remove(item))
  document.documentElement.classList.add(theme.value)
  if(theme.value === 'dark'){
    _isDark.value = true
  }else{
    _isDark.value = false
  }
}
function auto(){
  if(match.matches){
    ThemeArray.filter(item=>item!=='dark').forEach(item => document.documentElement.classList.remove(item))
    document.documentElement.classList.add('dark')
    _isDark.value = true
  }else{
    ThemeArray.filter(item=>item!=='light').forEach(item => document.documentElement.classList.remove(item))
    document.documentElement.classList.add('light')
    _isDark.value = false
  }
}
match.addEventListener('change',(e)=>{
  observer.disconnect()
  if(theme.value === 'auto'){
    auto()
  }else{
    if(theme.value === 'dark'){
      _isDark.value = true
    }else{
      _isDark.value = false
    }
  }
  observer.observe(document.documentElement, { attributes: true, attributeOldValue:true , attributeFilter: ['class'] });
})
const observer = new MutationObserver((mutationsList) => {
  observer.disconnect()
  for (const mutation of mutationsList) {
    if (mutation.attributeName === 'class') {
      const oldValue = mutation.oldValue
      const newValue = (mutation.target as HTMLElement).getAttribute(mutation.attributeName)
      // console.log(oldValue,'--->',newValue)
      if(!oldValue?.includes('nprogress-busy')&&!newValue?.includes('nprogress-busy')){//防止nprogress-busy类的变化导致主题控制出现异常
        for(let j=0;j<ThemeArray.length;j++){
          for(let i=0;i<document.documentElement.classList.length;i++){
            if(document.documentElement.classList[i] === ThemeArray[j]){
              if(document.documentElement.classList[i] === 'auto'){
                theme.value = 'auto'
                console.log('auto')
              }else{
                theme.value = ThemeArray[j]
                if(theme.value === 'dark'){
                  _isDark.value = true
                }else{
                  _isDark.value = false
                }
              }
              break;
            }
          }
        }
      }
    }
  }
  observer.observe(document.documentElement, { attributes: true, attributeOldValue: true, attributeFilter: ['class'] });
});
observer.observe(document.documentElement, { attributes: true, attributeOldValue: true, attributeFilter: ['class'] });
watch(theme, (value) => {
  observer.disconnect()
  if(value === 'auto'){
    auto()
  }else{
    ThemeArray.filter(item=>item!==theme.value).forEach(item => document.documentElement.classList.remove(item))
    document.documentElement.classList.add(value)
    if(theme.value === 'dark'){
      _isDark.value = true
    }else{
      _isDark.value = false
    }
  }
  localStorage.setItem('theme', value)
  observer.observe(document.documentElement, { attributes: true, attributeOldValue: true, attributeFilter: ['class'] });
})
window.addEventListener('storage', (event:any) => {
  observer.disconnect()
  if (event.key === 'theme'||event.key === null) {
    if(ThemeArray.includes(event.newValue as Theme)){
      if(event.newValue === 'auto'){
        theme.value = 'auto'
        auto()
      }else{
        theme.value = event.newValue as Theme
        ThemeArray.filter(item=>item!==event.newValue).forEach(item => document.documentElement.classList.remove(item))
        document.documentElement.classList.add(event.newValue as Theme);
        if(theme.value === 'dark'){
          _isDark.value = true
        }else{
          _isDark.value = false
        }
      }
    }else{
      resetTheme()
    }
  }else if((event.detail&&(event.detail.key==='theme'||event.detail.key===null))){
    resetTheme()
  }
  observer.observe(document.documentElement, { attributes: true, attributeOldValue: true, attributeFilter: ['class'] });
});
function resetTheme(){
  theme.value = defaultTheme
  localStorage.setItem('theme', defaultTheme)
  if(theme.value=='auto'){
    auto()
  }else{
    ThemeArray.filter(item=>item!==defaultTheme).forEach(item => document.documentElement.classList.remove(item))
    document.documentElement.classList.add(defaultTheme)
    if(theme.value === 'dark'){
      _isDark.value = true
    }else{
      _isDark.value = false
    }
  }
}
export const useTheme = () => theme
export const isDark = computed(()=>_isDark.value)