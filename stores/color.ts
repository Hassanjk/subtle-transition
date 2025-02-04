import { defineStore } from 'pinia'

export const useColorStore = defineStore('color', {
  state: () => ({
    color1: { r: 245, g: 245, b: 245 },
    color2: { r: 225, g: 225, b: 225 }
  }),
  actions: {
    setColors(color1: {r: number, g: number, b: number}, color2: {r: number, g: number, b: number}) {
      this.color1 = color1
      this.color2 = color2
    }
  }
})