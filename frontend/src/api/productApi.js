import axios from 'axios';

const BASE_URL = 'http://localhost:8091/api/products';

export const productApi = {
  // Fetch all listed products for the storefront
  getAllProducts: async () => {
    const res = await axios.get(BASE_URL);
    return res.data.data;
  },

  // Search products by title or keyword
  searchProducts: async (query) => {
    const res = await axios.get(`${BASE_URL}/search?query=${encodeURIComponent(query)}`);
    return res.data.data;
  },

  // Add a new product (Seller Studio form submission)
  createProduct: async (productData) => {
    const res = await axios.post(BASE_URL, productData);
    return res.data;
  },

  // Fetch product by ID
  getProductById: async (id) => {
    const res = await axios.get(`${BASE_URL}/${id}`);
    return res.data.data;
  },

  // Delete product listing
  deleteProduct: async (id) => {
    const res = await axios.delete(`${BASE_URL}/${id}`);
    return res.data;
  }
};