/**
 * 全屏等比缩放工具
 *
 * 当视口小于设计参考尺寸时，自动计算缩放比使内容完整填满屏幕。
 * PC 端视口通常 >= 参考尺寸，scale = 1，不做任何缩放。
 *
 * 使用方式：
 *   - calcFittedScale(designW, designH)  → 获取当前缩放比
 *   - applyFittedScale(el, designW, designH) → 自动应用到 DOM 元素并监听 resize
 */

/**
 * 计算内容在当前视口中完整显示的等比缩放比
 * scale = min(1, vw / designW, vh / designH)
 * 取宽高两个方向中更小的缩放比，保证内容不溢出
 */
export function calcFittedScale(designW: number, designH: number): number {
  return Math.min(1, window.innerWidth / designW, window.innerHeight / designH);
}

/**
 * 将等比缩放置信应用到指定 DOM 元素
 * 元素会以 absolute 定位居中于其 offsetParent，超出部分由父容器 overflow:hidden 裁剪
 *
 * @returns 清理函数，调用后移除 resize 监听
 */
export function applyFittedScale(
  el: HTMLElement,
  designW: number,
  designH: number,
): () => void {
  const update = () => {
    const s = calcFittedScale(designW, designH);
    Object.assign(el.style, {
      width: `${designW}px`,
      height: `${designH}px`,
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: `translate(-50%, -50%) scale(${s})`,
      transformOrigin: 'center center',
    } as CSSStyleDeclaration);
  };
  update();
  window.addEventListener('resize', update);
  return () => window.removeEventListener('resize', update);
}