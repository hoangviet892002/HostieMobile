export const parsePrice = (price: number) => {
  //  parse price with comma and dot
  // only parse interger
  let priceInt = Math.floor(price);
  const parsedPrice = priceInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parsedPrice;
};
