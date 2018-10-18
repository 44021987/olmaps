
export function getImg(type) {
  if (!type) return './img/default.png'
  const iconName = iconCode[type] || 'default'
  return `./img/icon/${iconName}.png`
}


