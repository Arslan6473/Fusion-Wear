import axios from "axios";
export const API_BASE_URI = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URI,

});

class ApiServices {
  //Auth
  singin(code) {
    return api.post(`/auth/google?code=${code}`);
  }
  //Images
  upload(data) {
    return api.post(`/images/upload`, data);
  }
  delete(data) {
    return api.delete(`/images/delete`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  }
  //Product 
  getProducts() {
    return api.get(`/products`);
  }
  createProduct(data) {
    return api.post(`/products`, data);
  }
  updateProduct(id, data) {
    return api.put(`/products/${id}`, data);
  }
  deleteProduct(id) {
    return api.delete(`/products/${id}`);
  }
  getProduct(id) {
    return api.get(`/products/${id}`);
  }

  //order
  createPayment(data){
    return api.post('/orders/payment',data)
  }
  createOrder(data){
    return api.post('/orders',data)
  }
  getUserOrders(userId){
    return api.get(`/orders/user/${userId}`)
  }
  getAllOrders(){
    return api.get('/orders')
  }
  updateOrder(id, data){
    return api.put(`/orders/${id}/status`,data)
  }
}


export default new ApiServices();
