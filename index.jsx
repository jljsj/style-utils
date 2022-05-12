const isUnitlessNumber = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridColumn: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
};
const prefixes = ['Webkit', 'ms', 'Moz', 'O'];

function prefixKey(prefix, key) {
  return prefix + key.charAt(0).toUpperCase() + key.substring(1);
}

Object.keys(isUnitlessNumber).forEach(function (prop) {
  prefixes.forEach(function (prefix) {
    isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
  });
});

const unquotedContentValueRegex = /^(normal|none|(\b(url\([^)]*\)|chapter_counter|attr\([^)]*\)|(no-)?(open|close)-quote|inherit)((\b\s*)|$|\s+))+)$/;

const IE = (() => {
  if (typeof document === 'undefined') {
    return false;
  }
  if (navigator && (navigator.userAgent.indexOf("MSIE 8.0") > 0 ||
    navigator.userAgent.indexOf("MSIE 9.0") > 0)) {
    return true;
  }
  return false;
})();

const rnd = 100000;

const colorLookup = {
  aqua: [0, 255, 255, 1],
  lime: [0, 255, 0, 1],
  silver: [192, 192, 192, 1],
  black: [0, 0, 0, 1],
  maroon: [128, 0, 0, 1],
  teal: [0, 128, 128, 1],
  blue: [0, 0, 255, 1],
  navy: [0, 0, 128, 1],
  white: [255, 255, 255, 1],
  fuchsia: [255, 0, 255, 1],
  olive: [128, 128, 0, 1],
  yellow: [255, 255, 0, 1],
  orange: [255, 165, 0, 1],
  gray: [128, 128, 128, 1],
  purple: [128, 0, 128, 1],
  green: [0, 128, 0, 1],
  red: [255, 0, 0, 1],
  pink: [255, 192, 203, 1],
  cyan: [0, 255, 255, 1],
  transparent: [255, 255, 255, 0],
};

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

const $cssList = {
  _lists: {
    transformsBase: ['translate', 'translateX', 'translateY', 'scale', 'scaleX', 'scaleY', 'skewX', 'skewY', 'rotateZ', 'rotate'],
    transforms3D: ['translate3d', 'translateZ', 'scaleZ', 'rotateX', 'rotateY', 'perspective'],
  },
  transformGroup: { translate: 1, translate3d: 1, scale: 1, scale3d: 1, rotate: 1, rotate3d: 1, skew: 1 },
  filter: ['grayScale', 'sepia', 'hueRotate', 'invert', 'brightness', 'contrast', 'blur'],
  filterConvert: { grayScale: 'grayscale', hueRotate: 'hue-rotate' },
};
$cssList._lists.transformsBase = !IE ? $cssList._lists.transformsBase.concat($cssList._lists.transforms3D) : $cssList._lists.transformsBase;

export const hexExp = /#([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3})/;

export const rgbAndHslExp = /((rgb|hsl)[a]?)+\((?:\d|\.\d)+(?:(deg|\%|)),[\s+]?(?:\d|\.\d)+(?:(deg|\%|)),[\s+]?(?:\d|\.\d)+(?:(deg|%|))(,[\s+]?(?:\d|\.\d)+(?:(deg|\%|)))?\)/;

export const colorRegExp = /#([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3})|((rgb|hsl)[a]?)+\((?:\d|\.\d)+(?:(deg|\%)?),[\s+]?(?:\d|\.\d)+(?:(deg|\%)?),[\s+]?(?:\d|\.\d)+(?:(deg|%)?)(,[\s+]?(?:\d|\.\d)+(?:(deg|\%)?))?\)/;

export const colorNumExp = /(?:\d|\.\d)+(%?)/g;

export const cssList = $cssList;

export function toCssLowerCase(d) {
  return d.replace(/[A-Z]/, ($1) => (`-${$1.toLocaleLowerCase()}`));
}

export function toStyleUpperCase(d) {
  return d.replace(/-(.?)/g, ($1) => ($1.replace('-', '').toLocaleUpperCase()));
}

export function toFixed(num, length) {
  const _rnd = length ? Math.pow(10, length) : rnd;
  const n = num | 0;
  const dec = num - n;
  let fixed = num;
  if (dec) {
    const r = ((dec * _rnd + (num < 0 ? -0.5 : 0.5) | 0) / _rnd);
    const t = r | 0;
    const str = r.toString();
    const decStr = str.split('.')[1] || '';
    fixed = `${num < 0 && !(n + t) ? '-' : ''}${n + t}.${decStr}`;
  }
  return parseFloat(fixed);
}

export function createMatrix(style) {
  if (typeof document === 'undefined') {
    return null;
  }
  const matrixs = ['WebKitCSS', 'MozCSS', 'DOM', 'MsCSS', 'MSCSS', 'OCSS', 'CSS']
    .filter(key => `${key}Matrix` in window);
  if (matrixs.length) {
    return new window[`${matrixs[0]}Matrix`](style);
  }
  console.warn('Browsers do not support matrix.');
  return '';
}

export function checkStyleName(p) {
  if (typeof document === 'undefined') {
    return null;
  }
  const a = ['O', 'Moz', 'ms', 'Ms', 'Webkit'];
  if (p !== 'filter' && p in document.body.style) {
    return p;
  }
  const _p = p.charAt(0).toUpperCase() + p.substr(1);
  const prefixCss = a.filter(key => `${key}${_p}` in document.body.style);
  return prefixCss[0] ? `${prefixCss[0]}${_p}` : null;
}

export function getGsapType(_p) {
  let p = _p;
  p = p === 'x' ? 'translateX' : p;
  p = p === 'y' ? 'translateY' : p;
  p = p === 'z' ? 'translateZ' : p;
  // p = p === 'r' ? 'rotate' : p;
  return p;
}

// href: https://www.w3schools.com/lib/w3color.js
const hueToRgb = (t1, t2, hue) => {
  if (hue < 0) hue += 6;
  if (hue >= 6) hue -= 6;
  if (hue < 1) return (t2 - t1) * hue + t1;
  else if (hue < 3) return t2;
  else if (hue < 4) return (t2 - t1) * (4 - hue) + t1;
  else return t1;
};

export function parseColor(value) {
  let colorArray = colorLookup.transparent;
  let color = value;
  let r;
  let g;
  let b;
  if (!color) {
    colorArray = colorLookup.transparent;
  } else if (colorLookup[color]) {
    colorArray = colorLookup[color];
  } else if (typeof color === 'number') {
    colorArray = [color >> 16, (color >> 8) & 255, color & 255];
  } else {
    if (color.charAt(color.length - 1) === ',') {
      color = color.substr(0, color.length - 1);
    }
    if (color.match(hexExp)) {
      color = color.substr(1);
      // is #FFF
      if (color.length === 3) {
        r = color.charAt(0);
        g = color.charAt(1);
        b = color.charAt(2);
        color = `${r}${r}${g}${g}${b}${b}ff`;
      }
      if (color.length === 6) {
        color += 'ff';
      }
      color = parseInt(color, 16);
      colorArray = [
        (color >> 24) & 255,
        (color >> 16) & 255,
        (color >> 8) & 255,
        parseFloat(((color & 255) / 255).toFixed(2)),
      ];
    } else if (color.match(/^hsl/)) {
      colorArray = color.match(colorNumExp);
      let alpha = colorArray[3];
      alpha =
        typeof alpha === 'string' && alpha.match('%')
          ? parseFloat(alpha) / 100
          : parseFloat(`${alpha || '1'}`);
      const hue = parseFloat(colorArray[0]) / 60;
      const sat = parseFloat(colorArray[1]) / 100;
      const light = parseFloat(colorArray[2]) / 100;
      const t2 = light <= 0.5 ? light * (sat + 1) : light + sat - light * sat
      const t1 = light * 2 - t2;
      r = Math.round(hueToRgb(t1, t2, hue + 2) * 255);
      g = Math.round(hueToRgb(t1, t2, hue) * 255);
      b = Math.round(hueToRgb(t1, t2, hue - 2) * 255);
      colorArray = [r, g, b, alpha];
    } else {
      // rgb(a?) 拆分
      colorArray = color.match(colorNumExp) || colorLookup.transparent;
      colorArray = colorArray.map(c => parseFloat(c));
      if (colorArray.length === 3) {
        colorArray.push(1)
      }
    }
  }
  return colorArray;
}

export function parseShadow(v, key) {
  /**
   * text-shadow: x y blur color;
   * box-shadow: x y blur spread color inset;
   */
  const textKey = key && toStyleUpperCase(key);
  if (!v) {
    if (textKey === 'boxShadow') {
      return [0, 0, 0, 0, 0, 0, 0, 0];//0.85
    }
    return [0, 0, 0, 0, 0, 0, 0];
  }
  let vArr = v
    .replace(/,\s+/gi, ',')
    .split(/\s+/)
    .filter(c => c);
  const inset = vArr.indexOf('inset');
  if (inset >= 0) {
    vArr.splice(inset, 1);
  }
  const colorStr =
    vArr.find(
      c =>
        colorLookup[c] ||
        c.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})|(rgb|hsl)+(?:a)?\((.*)\)/i),
    ) || 'black';
  const colorIndex = vArr.indexOf(colorStr);
  vArr.splice(colorIndex, 1);
  const color = parseColor(colorStr);
  color[3] = typeof color[3] === 'number' ? color[3] : 1;
  if (textKey === 'boxShadow' && vArr.length < 4) {
    vArr.push(0);
  }
  return vArr.concat(color, inset >= 0 ? ['inset'] : []);
}

export function getColor(v) {
  const rgba = v.length === 4 ? 'rgba' : 'rgb';
  const _vars = v.map((d, i) => i < 3 ? Math.round(d) : d);
  return `${rgba}(${_vars.join(',')})`;
}

export function isTransform(p) {
  return cssList._lists.transformsBase.indexOf(p) >= 0 ? 'transform' : p;
}

export function isConvert(p) {
  const cssName = isTransform(p);
  return cssList.filter.indexOf(cssName) >= 0 ? 'filter' : cssName;
}

export function splitFilterToObject(data) {
  if (data === 'none' || !data || data === '') {
    return null;
  }
  const filter = data.replace(/\s+/g, '').split(')').filter(item => item);
  const startData = {};
  filter.forEach(item => {
    const dataArr = item.split('(');
    startData[dataArr[0]] = dataArr[1];
  });
  return startData;
}

export function getMatrix(t) {
  const arr = t.match(/(?:\-|\b)[\d\-\.e]+\b/gi);
  const m = {};
  if (arr.length === 6) {
    m.m11 = parseFloat(arr[0]);
    m.m12 = parseFloat(arr[1]);
    m.m13 = 0;
    m.m14 = 0;
    m.m21 = parseFloat(arr[2]);
    m.m22 = parseFloat(arr[3]);
    m.m23 = 0;
    m.m24 = 0;
    m.m31 = 0;
    m.m32 = 0;
    m.m33 = 1;
    m.m34 = 0;
    m.m41 = parseFloat(arr[4]);
    m.m42 = parseFloat(arr[5]);
    m.m43 = 0;
    m.m44 = 0;
  } else {
    arr.forEach((item, i) => {
      const ii = i % 4 + 1;
      const j = Math.floor(i / 4) + 1;
      m[`m${j}${ii}`] = parseFloat(item);
    })
  }
  return m;
}

function transformNoMatrix(transform) {
  const tm = {};
  tm.translateX = 0;
  tm.translateY = 0;
  tm.translateZ = 0;
  tm.rotate = 0;
  tm.rotateX = 0;
  tm.rotateY = 0;
  tm.scaleX = 1;
  tm.scaleY = 1;
  tm.scaleZ = 1;
  tm.skewX = 0;
  tm.skewY = 0;
  tm.perspective = 0;
  (transform.trim().match(/(\w+)\([^\)]+\)/ig) || []).forEach((str) => {
    const strArray = str.split('(');
    const key = strArray[0].trim();
    let value = strArray[1].replace(')', '').trim()
    if (value.match(/%|em|rem/ig)) {
      console.warn(`value(${value}) must be absolute, not relative, has been converted to absolute.`);
    }
    value = value.replace(/px|deg|\)/ig, '');
    if (cssList.transformGroup[key] && key !== 'rotate') {
      value = value.split(',').map(num => parseFloat(num));
      if (key === 'scale3d' || key === 'translate3d') {
        ['X', 'Y', 'Z'].forEach((s, i) => {
          const $key = key.substring(0, key.length - 2);
          tm[`${$key}${s}`] = value[i] || tm[`${$key}${s}`];
        });
      } else if (key === 'rotate3d') {
        tm.rotateX = value[0] && value[3] || tm.rotateX;
        tm.rotateY = value[1] && value[3] || tm.rotateY;
        tm.rotate = value[2] && value[3] || tm.rotate;
      } else {
        ['X', 'Y'].forEach((s, i) => {
          tm[`${key}${s}`] = value[i] || tm[`${key}${s}`];
        });
      }
    } else {
      if (key === 'rotateZ') {
        tm.rotate = parseFloat(value) || tm.rotate;
      } else {
        tm[key] = parseFloat(value) || tm[key];
      }
    }
  });
  return tm;
}

export function getTransform(transform) {
  const _transform = !transform || transform === 'none' || transform === '' ? 'matrix(1, 0, 0, 1, 0, 0)' : transform;
  if (!_transform.match('matrix')) {
    return transformNoMatrix(transform);
  }
  const m = getMatrix(_transform);
  let m11 = m.m11;
  let m12 = m.m12;
  let m13 = m.m13;
  const m14 = m.m14;
  let m21 = m.m21;
  let m22 = m.m22;
  let m23 = m.m23;
  const m24 = m.m24;
  let m31 = m.m31;
  let m32 = m.m32;
  let m33 = m.m33;
  let m34 = m.m34;
  const m43 = m.m43;
  let t1;
  let t2;
  let t3;
  const tm = {};
  let angle = Math.atan2(m23, m33);
  const skewX = Math.tan(m21);
  const skewY = Math.tan(m12);
  let cos;
  let sin;
  // rotateX
  tm.rotateX = toFixed(angle * RAD2DEG) || 0;
  if (angle) {
    cos = Math.cos(-angle);
    sin = Math.sin(-angle);
    t1 = m21 * cos + m31 * sin;
    t2 = m22 * cos + m32 * sin;
    t3 = m23 * cos + m33 * sin;
    m31 = m21 * -sin + m31 * cos;
    m32 = m22 * -sin + m32 * cos;
    m33 = m23 * -sin + m33 * cos;
    m34 = m24 * -sin + m34 * cos;
    m21 = t1;
    m22 = t2;
    m23 = t3;
  }
  // rotateY
  angle = Math.atan2(-m13, m33);
  tm.rotateY = toFixed(angle * RAD2DEG) || 0;
  if (angle) {
    cos = Math.cos(-angle);
    sin = Math.sin(-angle);
    t1 = m11 * cos - m31 * sin;
    t2 = m12 * cos - m32 * sin;
    t3 = m13 * cos - m33 * sin;
    m32 = m12 * sin + m32 * cos;
    m33 = m13 * sin + m33 * cos;
    m34 = m14 * sin + m34 * cos;
    m11 = t1;
    m12 = t2;
    m13 = t3;
  }
  // rotateZ
  angle = Math.atan2(m12, m11);
  tm.rotate = toFixed(angle * RAD2DEG) || 0;
  if (angle) {
    cos = Math.cos(angle);
    sin = Math.sin(angle);
    t1 = m11 * cos + m12 * sin;
    t2 = m21 * cos + m22 * sin;
    t3 = m31 * cos + m32 * sin;
    m12 = m12 * cos - m11 * sin;
    m22 = m22 * cos - m21 * sin;
    m32 = m32 * cos - m31 * sin;
    m11 = t1;
    m21 = t2;
    m31 = t3;
  }

  if (tm.rotateX && Math.abs(tm.rotateX) + Math.abs(tm.rotate) > 359.9) {
    tm.rotateX = tm.rotate = 0;
    tm.rotateY = (180 - tm.rotateY) || 0;
  }

  tm.scaleX = toFixed(Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13));
  tm.scaleY = toFixed(Math.sqrt(m22 * m22 + m23 * m23));
  tm.scaleZ = toFixed(Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33));
  // 不管 skewX skewY了；
  tm.skewX = skewX === -skewY ? 0 : skewX;
  tm.skewY = skewY === -skewX ? 0 : skewY;
  tm.perspective = m34 ? 1 / ((m34 < 0) ? -m34 : m34) : 0;
  tm.translateX = m.m41;
  tm.translateY = m.m42;
  tm.translateZ = m43;
  return tm;
}

export function stylesToCss(key, value) {
  let _value;
  if (!isUnitlessNumber[key] && typeof value === 'number') {
    _value = ` ${value}px`;
  } else if (key === 'content' && !unquotedContentValueRegex.test(value)) {
    _value = `'${value.replace(/'/g, "\\'")}'`;
  }
  return _value || value;
}

export function getUnit(p, v) {
  const currentUnit = v && v.toString().replace(/[^a-z|%]/ig, '');
  let unit = '';
  if (p.indexOf('translate') >= 0 || p.indexOf('perspective') >= 0 || p.indexOf('blur') >= 0) {
    unit = 'px';
  } else if (p.indexOf('skew') >= 0 || p.indexOf('rotate') >= 0) {
    unit = 'deg';
  }
  return currentUnit || unit;
}

export function getValues(p, d, u) {
  return `${p}(${d}${u || ''})`;
}

export function findStyleByName(cssArray, name) {
  let ret = null;
  if (cssArray) {
    cssArray.forEach(_cname => {
      if (ret) {
        return;
      }
      const cName = _cname.split('(')[0];
      const a = (cName in cssList.transformGroup && name.substring(0, name.length - 1).indexOf(cName) >= 0);
      const b = (name in cssList.transformGroup && cName.substring(0, cName.length - 1).indexOf(name) >= 0);
      const c = cName in cssList.transformGroup && name in cssList.transformGroup && (cName.substring(0, cName.length - 2) === name || name.substring(0, name.length - 2) === cName);
      if (cName === name || a || b || c) {
        ret = _cname;
      }
    });
  }
  return ret;
}

export function mergeStyle(current, change) {
  if (!current || current === '') {
    return change;
  }
  if (!change || change === '') {
    return current;
  }
  const _current = current.replace(/\s/g, '').split(')').filter(item => item !== '' && item).map(item => `${item})`);
  const _change = change.replace(/\s/g, '').split(')').filter(item => item !== '' && item);
  _change.forEach(changeOnly => {
    const changeArr = changeOnly.split('(');
    const changeName = changeArr[0];
    const currentSame = findStyleByName(_current, changeName);
    if (!currentSame) {
      _current.push(`${changeOnly})`);
    } else {
      const index = _current.indexOf(currentSame);
      _current[index] = `${changeOnly})`;
    }
  });
  _current.forEach((item, i) => {
    if (item.indexOf('perspective') >= 0 && i) {
      _current.splice(i, 1);
      _current.unshift(item);
    }
  });
  return _current.join(' ').trim();
}
