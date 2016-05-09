const IE = (() => {
    if (document.documentMode) {
  return document.documentMode;
}
for (let i = 7; i > 4; i--) {
  let div = document.createElement('div');
  div.innerHTML = '<!--[if IE ' + i + ']><span class="is-ie"></span><![endif]-->';
  if (div.getElementsByClassName('is-ie').length) {
    div = null;
    return i;
  }
}
return undefined;
})();

const colorLookup = {
  aqua: [0, 255, 255],
  lime: [0, 255, 0],
  silver: [192, 192, 192],
  black: [0, 0, 0],
  maroon: [128, 0, 0],
  teal: [0, 128, 128],
  blue: [0, 0, 255],
  navy: [0, 0, 128],
  white: [255, 255, 255],
  fuchsia: [255, 0, 255],
  olive: [128, 128, 0],
  yellow: [255, 255, 0],
  orange: [255, 165, 0],
  gray: [128, 128, 128],
  purple: [128, 0, 128],
  green: [0, 128, 0],
  red: [255, 0, 0],
  pink: [255, 192, 203],
  cyan: [0, 255, 255],
  transparent: [255, 255, 255, 0],
};
const _hue = (hh, m1, m2)=> {
  let h = (hh > 1) ? hh - 1 : hh;
  h = (hh < 0) ? hh + 1 : h;
  const a = (h * 3 < 2) ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1;
  const b = (h < 0.5) ? m2 : a;
  const c = (h * 6 < 1) ? m1 + (m2 - m1) * h * 6 : b;
  return (c * 255 + 0.5) | 0;
};


const CSS = {
  _lists: {
    transformsBase: ['translate', 'translateX', 'translateY', 'scale', 'scaleX', 'scaleY', 'skewX', 'skewY', 'rotateZ', 'rotate'],
    transforms3D: ['translate3d', 'translateZ', 'scaleZ', 'rotateX', 'rotateY', 'perspective'],
  },
  filter: ['grayScale', 'sepia', 'hueRotate', 'invert', 'brightness', 'contrast', 'blur'],
  filterConvert: { grayScale: 'grayscale', hueRotate: 'hue-rotate' },
  transformGroup: { translate: 1, translate3d: 1, scale: 1, scale3d: 1, rotate: 1, rotate3d: 1 },

  getGsapType(_p) {
  let p = _p;
  p = p === 'x' ? 'translateX' : p;
  p = p === 'y' ? 'translateY' : p;
  p = p === 'z' ? 'translateZ' : p;
  p = p === 'r' ? 'rotate' : p;
  return p;
},

parseShadow(v) {
  let vArr = v.split(' ');
  const color = this.parseColor(vArr[3]);
  color[3] = typeof color[3] === 'number' ? color[3] : 1;
  vArr = vArr.splice(0, 3);
  return vArr.concat(color);
},

parseColor(_v) {
  let a;
  let r;
  let g;
  let b;
  let h;
  let s;
  let l;
  let v = _v;
  const _numExp = /(?:\d|\-\d|\.\d|\-\.\d)+/g;
  if (!v) {
    a = colorLookup.black;
  } else if (typeof v === 'number') {
    a = [v >> 16, (v >> 8) & 255, v & 255];
  } else {
    if (v.charAt(v.length - 1) === ',') {
      v = v.substr(0, v.length - 1);
    }
    if (colorLookup[v]) {
      a = colorLookup[v];
    } else if (v.charAt(0) === '#') {
      // is #FFF
      if (v.length === 4) {
        r = v.charAt(1);
        g = v.charAt(2);
        b = v.charAt(3);
        v = '#' + r + r + g + g + b + b;
      }
      v = parseInt(v.substr(1), 16);
      a = [v >> 16, (v >> 8) & 255, v & 255];
    } else if (v.substr(0, 3) === 'hsl') {
      a = v.match(_numExp);
      h = (Number(a[0]) % 360) / 360;
      s = Number(a[1]) / 100;
      l = Number(a[2]) / 100;
      g = (l <= 0.5) ? l * (s + 1) : l + s - l * s;
      r = l * 2 - g;
      if (a.length > 3) {
        a[3] = Number(a[3]);
      }
      a[0] = _hue(h + 1 / 3, r, g);
      a[1] = _hue(h, r, g);
      a[2] = _hue(h - 1 / 3, r, g);
    } else {
      a = v.match(_numExp) || colorLookup.transparent;
    }
    a[0] = Number(a[0]);
    a[1] = Number(a[1]);
    a[2] = Number(a[2]);

    if (a.length > 3) {
      a[3] = Number(a[3]);
    }
  }
  return a;
},

getArrayToColor(arr) {
  const color = 'rgba(';
  const _arr = arr.map((item, i)=> {
      if (i < 3) {
    return parseInt(item, 10);
  }
  return item;
});
  return color + _arr.join(',') + ')';
},

splitStyle(styleArr){
  const arr = [];
  styleArr.forEach(_item => {
    const _itemArr = _item.split('(');
  const cssName = _itemArr[0];
  const data = _itemArr[1];
  const dataArr = data.replace(')', '').split(',');
  if (dataArr.length === 1) {
    return arr.push(_item);
  }
  if (cssName.indexOf('translate') >= 0) {
    arr.push(this.getValues('translateX', dataArr[0]));
    if (dataArr[1]) {
      arr.push(this.getValues('translateY', dataArr[1]));
    }
    if (cssName === 'translate3d' && dataArr[2]) {
      arr.push(this.getValues('translateZ', dataArr[2]));
    }
  } else if (cssName === 'scale') {
    arr.push(this.getValues('scaleX', dataArr[0]));
    arr.push(this.getValues('scaleY', dataArr[1] || dataArr[0]));
  } else if (cssName === 'skew') {
    if (dataArr[0]) {
      arr.push(this.getValues('skewX', dataArr[0]));
    }
    if (dataArr[1]) {
      arr.push(this.getValues('skewY', dataArr[1]));
    }
  }
});
  return arr;
},

getTransformStart(name, obj) {
  if (name in obj) {
    return obj[name];
  }
  if (name.indexOf('translate') >= 0) {
    if ('translate' in obj || 'translate3d' in obj) {
      switch (name) {
        case 'translateX':
          return obj.translate.split(',')[0];
        case 'translateY':
          return obj.translate.split(',')[1];
        case 'translateZ':
          return obj.translate.split(',')[2];
        default :
          return null;
      }
    }
  } else if (name.indexOf('rotate') >= 0) {
    if ('rotate' in obj || 'rotate3d' in obj) {
      switch (name) {
        case 'rotateX':
          return obj.rotate.split(',')[0];
        case 'rotateY':
          return obj.rotate.split(',')[1];
        case 'rotateZ':
          return obj.rotate.split(',')[2];
        default :
          return null;
      }
    }
  } else if (name.indexOf('scale') >= 0) {
    if ('scale' in obj) {
      switch (name) {
        case 'scaleX':
          return obj.scale.split(',')[0];
        case 'scaleY':
          return obj.scale.split(',')[1];
        default :
          return null;
      }
    }
  }
  return '';
},
mergeTransformName(a, b) {
  const belongTransform = this.findStyleByName(a, b);
  if (belongTransform) {
    const bArr = belongTransform.split('(');
    const dataArr = bArr[1].replace(')', '').split(',');
    switch (b) {
      case 'translateY' || 'scaleY' || 'rotateY':
        return dataArr[1];
      case 'translateZ' || 'rotateZ':
        return dataArr[2];
      default :
        return dataArr[0];
    }
  }
  return null;
},
findStyleByName(cssArray, name) {
  let ret = null;
  if (cssArray) {
    cssArray.forEach(_cname=> {
      if (ret) {
      return;
    }
    const cName = _cname.split('(')[0];
    const a = (cName in this.transformGroup && name.substring(0, name.length - 1).indexOf(cName) >= 0);
    const b = (name in this.transformGroup && cName.substring(0, cName.length - 1).indexOf(name) >= 0);
    const c = cName in this.transformGroup && name in this.transformGroup && (cName.substring(0, cName.length - 2) === name || name.substring(0, name.length - 2) === cName);
    if (cName === name || a || b || c) {
      ret = _cname;
    }
  });
  }
  return ret;
},

strToArray(){

},

mergeStyleNew(current, change){
  if (!current || current === '') {
    return change;
  }
  if (!change || change === '') {
    return current;
  }
  const _current = current.replace(/\s/g, '').split(')').filter(item=>item !== '' && item).map(item => `${item})`);
const _change = change.replace(/\s/g, '').split(')').filter(item=>item !== '' && item);
_change.forEach(changeOnly => {
  const changeArr = changeOnly.split('(');
const changeName = changeArr[0];
const currentSame = this.findStyleByName(_current, changeName);
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
})
return _current.join(' ').trim();
},


mergeStyle(current, change) {
  // console.log(current,'dsf', change)
  if (!current || current === '') {
    return change;
  }
  if (!change || change === '') {
    return current;
  }
  const addArr = [];

  const _current = current.replace(/\s/g, '').split(')').filter(item=>item !== '' && item);
  const _change = change.replace(/\s/g, '').split(')').filter(item=>item !== '' && item);

  // 如果变动的在旧的里没有，把变动的插回进去；
  _change.forEach(changeOnly => {
    const changeArr = changeOnly.split('(');
  const changeOnlyName = changeArr[0];
  const changeDataArr = changeArr[1].split(',');
  const currentSame = this.findStyleByName(_current, changeOnlyName);
  if (!currentSame) {
    addArr.push(changeOnlyName + '(' + changeDataArr.join(',') + ')');
  }
});
  console.log(_current)
  _current.forEach(currentOnly => {
    const currentArr = currentOnly.split('(');
  const currentOnlyName = currentArr[0];

  const currentDataArr = currentArr[1].split(',');
  const changeSame = this.findStyleByName(_change, currentOnlyName);
  // 三种情况，ＸＹＺ时分析，空时组合前面的分析，
  if (changeSame) {
    const changeArr = changeSame.split('(');
    const changeOnlyName = changeArr[0];
    const changeDataArr = changeArr[1].split(',');
    if (currentOnlyName === changeOnlyName) {
      addArr.push(changeSame + ')');
    } else if (currentOnlyName in this.transformGroup && changeOnlyName.substring(0, changeOnlyName.length - 1).indexOf(currentOnlyName) >= 0) {
      switch (changeOnlyName) {
        case 'translateX' || 'scaleX' || 'rotateX':
          currentDataArr[0] = changeDataArr.join();
          break;
        case 'translateY' || 'scaleY' || 'rotateY':
          currentDataArr[1] = changeDataArr.join();
          break;
        case 'translateZ' || 'rotateZ':
          currentDataArr[2] = changeDataArr.join();
          break;
        default :
          return null;
      }
      addArr.push(currentOnlyName + '(' + currentDataArr.join(',') + ')');
    } else if (changeOnlyName in this.transformGroup && currentOnlyName.substring(0, currentOnlyName.length - 1).indexOf(changeOnlyName) >= 0) {
      addArr.push(changeOnlyName + '(' + changeDataArr.join(',') + ')');
    } else if (changeOnlyName in this.transformGroup && currentOnlyName in this.transformGroup && currentOnlyName.substring(0, currentOnlyName.length - 2) === changeOnlyName) {
      // 如果是3d时,且一个为2d时；
      switch (changeOnlyName) {
        case 'translateX' || 'scaleX' || 'rotateX':
          currentDataArr[0] = changeDataArr[0];
          break;
        case 'translateY' || 'scaleY' || 'rotateY':
          currentDataArr[1] = changeDataArr[1];
          break;
        default :
          return null;
      }
      addArr.push(currentOnlyName + '(' + currentDataArr.join(',') + ')');
    }
  } else {
    addArr.push(currentOnlyName + '(' + currentDataArr.join(',') + ')');
  }
});


  if (!addArr.length) {
    addArr.push(current, change);
  }
  addArr.forEach((item, i) => {
    if (item.indexOf('perspective') >= 0 && i) {
    addArr.splice(i, 1);
    addArr.unshift(item);
  }
});
  return addArr.join(' ').trim();
},


getValues(p, d, u) {
  return `${p}(${d}${u || ''})`;
},

getUnit(p, v){
  const currentUnit = v.toString().replace(/[^a-z|%]/ig, '');
  let unit = '';
  if (p.indexOf('translate') >= 0 || p.indexOf('perspective') >= 0) {
    unit = 'px';
  } else if (p.indexOf('skew') >= 0 || p.indexOf('rotate') >= 0) {
    unit = 'deg';
  }
  return currentUnit || unit;
},

isTransform(p) {
  return this._lists.transformsBase.indexOf(p) >= 0 ? 'transform' : p;
},

isConvert(p){
  const cssName = this.isTransform(p);
  return this.filter.indexOf(cssName) >= 0 ? 'filter' : cssName;
},

getShadowParam(v, d) {
  let color = [];
  for (let i = 3; i < d.length; i++) {
    color.push(d[i]);
  }
  color = this.getArrayToColor(color);
  const vArr = v.split(' ');
  const blur = [];
  // 获取单位
  vArr.forEach((item, ii) => {
    if (ii < 3) {
    const unit = item.toString().replace(/[^a-z|%]/ig, '');
    blur.push(d[ii] + unit);
  }
});
  return blur.join(' ') + ' ' + color;
},

getParam(p, v, dd) {
  const unit = this.getUnit(p, v);
  if (!dd && dd !== '' && dd !== 0) {
    return this.getValues(p, parseFloat(v.toString().replace('=', '')), unit);
  }
  const d = Array.isArray(dd) && dd.length === 1 ? dd[0] : dd;
  if (p.indexOf('translate') >= 0 || p.indexOf('perspective') >= 0 ||
    p.indexOf('skew') >= 0 || p.indexOf('rotate') >= 0 ||
    p.indexOf('scale') >= 0) {
    return this.getValues(p, d, unit)
  } else if (p.indexOf('Shadow') >= 0 || p.indexOf('shadow') >= 0) {
    return this.getShadowParam(v, d);
  } else if (p.indexOf('color') >= 0 || p.indexOf('Color') >= 0) {
    return this.getArrayToColor(d);
  }
  return d + (unit || 0);
},
getFilterParam(current, change, data) {
  let unit;
  let changeArr = change.replace(/\s/g, '').split(')').filter(item => item !== '' && item);
  const currentArr = current.replace(/\s/g, '').split(')').filter(item => item !== '' && item);
  changeArr = changeArr.map(changeOnly=> {
      const changeOnlyArr = changeOnly.split('(');
  const changeOnlyName = changeOnlyArr[0];
  if (!changeOnlyArr[1]) {
    return '';
  }
  let changeDataArr = changeOnlyArr[1].replace(')', '').split(',');
  const currentSame = this.findStyleByName(currentArr, changeOnlyName);
  if (currentSame) {
    const currentDataArr = currentSame.split('(')[1].replace(')', '').split(',');
    changeDataArr = changeDataArr.map((dataOnly, i) => {
      unit = dataOnly.toString().replace(/[^a-z|%]/ig, '');
    const currentDataOnly = currentDataArr[i];
    const currentUnit = currentDataOnly.toString().replace(/[^a-z|%]/ig, '');
    const dataOnlyNumber = parseFloat(dataOnly);
    const currentDataOnlyNumber = parseFloat(currentDataOnly);
    const differData = currentUnit !== unit ? dataOnlyNumber : dataOnlyNumber - currentDataOnlyNumber;
    const _data = differData * data + currentDataOnlyNumber + unit;
    return _data;
  });
  } else {
    changeDataArr = changeDataArr.map(dataOnly => {
      unit = dataOnly.toString().replace(/[^a-z|%]/ig, '');
    return parseFloat(dataOnly) * data + unit;
  });
  }
  return changeOnlyName + '(' + changeDataArr.join(',') + ')';
});
  return changeArr.join(' ');
},
};
CSS._lists.transformsBase = !(IE <= 9) ? CSS._lists.transformsBase.concat(CSS._lists.transforms3D) : CSS._lists.transformsBase;
export default CSS;
