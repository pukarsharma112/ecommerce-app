export const getShippingCharge = (deliveryMethod) => {
  return deliveryMethod === "standard" ? 5 : 16;
};
