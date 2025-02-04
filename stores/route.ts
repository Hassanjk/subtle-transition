import { defineStore } from 'pinia'

export const useRouteStore = defineStore('route', {
  state: () => ({
    url: '',
  }),
  actions: {
    setUrl(url: string) {
      this.url = url
    },
  },
})