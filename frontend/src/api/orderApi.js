import axiosClient from './axiosClient';

export const orderApi = {
  placeOrder: (orderData) => axiosClient.post('/orders', orderData),
  getUserOrders: (userId) => axiosClient.get(`/orders/user/${userId}`),
  getOrderDetails: (orderNumber) => axiosClient.get(`/orders/${orderNumber}`)
};