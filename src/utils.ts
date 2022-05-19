export const selectRandomItemFromArray = (items : Array<any>) => {
  return items[Math.floor(Math.random() * items.length)]
}