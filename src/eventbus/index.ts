// type Listener<T extends any[] = any[]> = (...args: T) => void
// export class EventBus<Events extends Record<string, any[]>> {
//   private map = new Map<keyof Events, Set<Listener>>()
//   on<K extends keyof Events>(key: K, fn: Listener<Events[K]>) {
//     let set = this.map.get(key)
//     if (!set) {
//       set = new Set()
//       this.map.set(key, set)
//     }
//     set.add(fn)
//   }
//   once<K extends keyof Events>(key: K, fn: Listener<Events[K]>) {
//     const wrapper: Listener<Events[K]> = (...args) => {
//       fn(...args)
//       this.off(key, wrapper)
//     }
//     this.on(key, wrapper)
//   }
//   off<K extends keyof Events>(key: K, fn?: Listener<Events[K]>) {
//     const set = this.map.get(key)
//     if (!set) return
//     if (fn) {
//       set.delete(fn)
//       if (set.size === 0) {
//         this.map.delete(key)
//       }
//     } else {
//       this.map.delete(key)
//     }
//   }
//   emit<K extends keyof Events>(key: K, ...args: Events[K]) {
//     const set = this.map.get(key)
//     if (!set) return
//     // 拷贝一份，避免 emit 中 off/on 影响遍历
//     for (const fn of [...set]) {
//       try {
//         fn(...args)
//       } catch (err) {
//         console.error(`[EventBus:${String(key)}]`, err)
//       }
//     }
//   }
//   clear() {
//     this.map.clear()
//   }
// }
// export const eventbus = new Eventbus()





type Callback = (...args: any[]) => void

interface BusMessage {
  __from: string
  key: string
  args: any[]
}

export default class Eventbus {
  private map: Record<string, Callback[]>
  private channel: BroadcastChannel
  private id: string

  constructor(name = '__GLOBAL_EVENTBUS__') {
    this.map = {}
    this.id = Math.random().toString(36).slice(2)

    this.channel = new BroadcastChannel(name)

    this.channel.onmessage = (e) => {
      const msg: BusMessage = e.data
      if (!msg || msg.__from === this.id) return

      this.trigger(msg.key, msg.args)
    }
  }

  /** 内部触发，不广播 */
  private trigger(key: string, args: any[]) {
    this.map[key]?.slice().forEach(fn => {
      fn(...args)
    })
  }

  /** 广播 + 本地 */
  emit(key: string, ...args: any[]) {
    // 本地
    this.trigger(key, args)

    // 广播
    this.channel.postMessage({
      __from: this.id,
      key,
      args
    } as BusMessage)
  }

  on(key: string, callback: Callback) {
    ;(this.map[key] ||= []).push(callback)
  }

  off(key: string, callback?: Callback) {
    if (!callback) {
      delete this.map[key]
      return
    }

    const list = this.map[key]
    if (!list) return

    const idx = list.indexOf(callback)
    if (idx >= 0) list.splice(idx, 1)
  }

  once(key: string, callback: Callback) {
    const fn: Callback = (...args) => {
      callback(...args)
      this.off(key, fn)
    }
    this.on(key, fn)
  }

  destroy() {
    this.map = {}
    this.channel.close()
  }
}
export const eventbus = new Eventbus()