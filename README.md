# style-utils

tween-one 和 scroll-anim, queue-anim 的样式

color 和 transform 的分解..
 
### toCssLowerCase(v)

toCssLowerCase('lineHeight') => line-height;

### toStyleUpperCase(d)
toStyleUpperCase('line-height') => lineHeight;

### checkStyleName(p)
checkStyleName('filter') => WebkitFilter | MsFilter | MozFilter

### parseColor(value)

parseColor('#ff0') => [255,255,0,1];
parseColor('#ffff00') => [255,255,0,1];
parseColor('#ffff0080') => [255,255,0,0.5];
parseColor('rgb(255,255,0)') => [255,255,0,1];
parseColor('rgba(255,255,0,0.5)') => [255,255,0,0.5];
parseColor('hsl(60, 100%, 50%)') => [255,255,0,1];
parseColor('hsl(60deg 100% 50%)') => [255,255,0,1];
parseColor('hsl(60 100% 50% / 50%)') => [255,255,0,0.5];
parseColor('hsla(60,100%,50%,0.5)') => [255,255,0,0.5];

### parseShadow(v, key);
parseShadow('0 10px 10px #ffff00', 'text-shadow') => ['0', '10px', '10px', 255, 255, 0, 1];

### getColor(v)
getColor([255,255,0]) => rgb(255,255,0);

### getTransform(transform)
getTransform('translateX(100px) rotate(30deg)') => {translateX: 100, translateY: 0, rotate: 30, ...}
### mergeStyle(current, change)

mergeStyle('translate(30px,50em)', 'translateY(20em)') => translate(30px, 20em)