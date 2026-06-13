const API_URL = "http://localhost:5000/api";

/* ===========================
   AUTH
=========================== */

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  return response.json();
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  });

  return response.json();
}

/* ===========================
   ORDERS
=========================== */

export async function createOrder(orderData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });

  return response.json();
}

export async function getMyOrders() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/orders/my-orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.json();
}