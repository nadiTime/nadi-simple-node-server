export const selectRandomItemFromArray = (items : any[]) => {
  return items[Math.floor(Math.random() * items.length)]
}

export const shouldRefetch = (time: number) => {
  const now = new Date().getTime();
  return Math.floor((now - time) / 60000) < 10;
}