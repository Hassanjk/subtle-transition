import { gsap } from 'gsap'
import { getPointerPos, getMouseDistance, lerp } from './utils'

let mousePos = { x: 0, y: 0 }
let cacheMousePos = { ...mousePos }
let lastMousePos = { ...mousePos }

const handlePointerMove = (ev) => {
  mousePos = getPointerPos(ev.touches ? ev.touches[0] : ev)
}

// Move event listeners inside a check for window
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', handlePointerMove)
  window.addEventListener('touchmove', handlePointerMove)
}

export class ImageTrail {
  DOM = { el: null }
  images = []
  imagesTotal = 0
  imgPosition = 0
  zIndexVal = 1
  activeImagesCount = 0
  isIdle = true
  threshold = 80

  constructor(DOM_el) {
    this.DOM.el = DOM_el
    this.images = [...this.DOM.el.querySelectorAll('.content__img')].map(img => ({
      el: img,
      inner: img.querySelector('.content__img-inner'),
      rect: img.getBoundingClientRect()
    }))
    
    this.imagesTotal = this.images.length
    
    requestAnimationFrame(() => this.render())
  }

  render() {
    let distance = getMouseDistance(mousePos, lastMousePos)
    
    cacheMousePos.x = lerp(cacheMousePos.x || mousePos.x, mousePos.x, 0.1)
    cacheMousePos.y = lerp(cacheMousePos.y || mousePos.y, mousePos.y, 0.1)

    if (distance > this.threshold) {
      this.showNextImage()
      lastMousePos = mousePos
    }

    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1
    }

    requestAnimationFrame(() => this.render())
  }

  showNextImage() {
    ++this.zIndexVal
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0
    
    const img = this.images[this.imgPosition]
    
    gsap.killTweensOf(img.el)

    gsap.timeline({
      onStart: () => {
        this.activeImagesCount++
        this.isIdle = false
      },
      onComplete: () => {
        this.activeImagesCount--
        if (this.activeImagesCount === 0) {
          this.isIdle = true
        }
      }
    })
    .fromTo(img.el, {
      opacity: 1,
      scale: 0,
      zIndex: this.zIndexVal,
      x: cacheMousePos.x - img.rect.width/2,
      y: cacheMousePos.y - img.rect.height/2
    }, {
      duration: 0.4,
      ease: 'power1',
      scale: 1,
      x: mousePos.x - img.rect.width/2,
      y: mousePos.y - img.rect.height/2
    }, 0)
    .fromTo(img.inner, {
      scale: 2,
      filter: 'brightness(200%)'
    }, {
      duration: 0.4,
      ease: 'power1',
      scale: 1,
      filter: 'brightness(100%)'
    }, 0)
    .to(img.el, {
      duration: 0.4,
      ease: 'power3',
      opacity: 0,
      scale: 0.2
    }, 0.4)
  }
}
