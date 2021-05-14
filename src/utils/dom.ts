/* eslint-disable */
import Vue from 'vue'
const isServer = Vue.prototype.$isServer
/**
 * 获取dom元素size和position信息
 * @param el    HTMLElement
 * @return {object}
 */
export function getRect(el:any) {
  if (!el) return null

  if (el instanceof (window as any).SVGElement) {
    let rect = el.getBoundingClientRect()

    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }
  } else {
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight
    }
  }
}

/**
 * 设置指定元素的style
 *
 * @param el    HTMLElement
 * @param {object} styleObject
 */
export function setStyle(el:any, styleObject:any = {}) {
  for (let prop in styleObject) {
    if (!styleObject.hasOwnProperty(prop)) continue

    el.style[prop] = styleObject[prop]
  }
}

/**
 * 获取document宽、高、滚动条等信息
 */
export function getDocumentRect() {
  let {
    documentElement,
    body
  } = document

  const clientWidth = documentElement.clientWidth || body.clientWidth
  const clientHeight = documentElement.clientHeight || body.clientHeight
  const scrollTop = documentElement.scrollTop || body.scrollTop
  const scrollHeight = documentElement.scrollHeight || body.scrollHeight

  return {
    clientWidth,
    clientHeight,
    scrollTop,
    scrollHeight
  }
}

/**
 * 获取DOM元素的offset信息
 *
 * @param target
 * @return {{top: number, left: number}}
 */
export function getOffset(target:any) {
  let offset = {
    top: 0,
    left: 0
  }

  let offsetParent = target.offsetParent

  offset.top += target.offsetTop
  offset.left += target.offsetLeft

  for (; offsetParent !== null;) {
    offset.top += offsetParent.offsetTop
    offset.left += offsetParent.offsetLeft
    offsetParent = offsetParent.offsetParent
  }

  return offset
}

/* istanbul ignore next */
export const on = (function() {
  if (!isServer && document.addEventListener) {
    return function(element:any, event:any, handler:any) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function(element:any, event:any, handler:any) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/* istanbul ignore next */
export const off = (function() {
  if (!isServer && document.removeEventListener) {
    return function(element:any, event:any, handler:any) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function(element:any, event:any, handler:any) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()
