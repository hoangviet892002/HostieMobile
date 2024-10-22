export const parsePrice = (price: number) => {
  //  parse price with comma and dot
  const parsedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parsedPrice;
};
