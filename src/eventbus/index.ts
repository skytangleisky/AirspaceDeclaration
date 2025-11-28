import EventEmitter from 'events';

// type Listener = (...args: any[]) => void;

// class EventEmitter {
//   private events: Record<string, Listener[]> = {};

//   on(event: string, fn: Listener) {
//     (this.events[event] = this.events[event] || []).push(fn);
//   }

//   off(event: string, fn?: Listener) {
//     if (!fn) {
//       this.events[event] = [];
//       return;
//     }
//     this.events[event] = (this.events[event] || []).filter(l => l !== fn);
//   }

//   once(event: string, fn: Listener) {
//     const wrapper = (...args: any[]) => {
//       fn(...args);
//       this.off(event, wrapper);
//     };
//     this.on(event, wrapper);
//   }

//   emit(event: string, ...args: any[]) {
//     (this.events[event] || []).forEach(fn => fn(...args));
//   }
// }
export const eventbus = new EventEmitter()
