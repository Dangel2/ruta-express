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

export async function cancelOrder(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/orders/${id}/cancel`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.json();
}

/* ===========================
   ADMIN
=========================== */

export async function adminLogin(credentials) {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  });

  return response.json();
}

export async function getDashboardStats() {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(`${API_URL}/admin/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.json();
}

export async function getAllOrders() {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(`${API_URL}/admin/orders`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.json();
}

export async function updateOrderStatus(id, status) {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(
    `${API_URL}/admin/orders/${id}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    }
  );

  return response.json();
}

export async function deleteAdminOrder(id) {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(
    `${API_URL}/admin/orders/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.json();
}

export async function getAllCustomers() {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(`${API_URL}/admin/customers`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.json();
}

/* ===========================
   PROFILE
=========================== */

export async function getMyProfile() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/customers/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.json();
}

export async function updateMyProfile(profileData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/customers/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(profileData)
  });

  return response.json();
}

export async function changeMyPassword(passwordData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/customers/me/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(passwordData)
  });

  return response.json();
}

/* ===========================
   PROMOTIONS
=========================== */

export async function getPublicPromotions() {
  const response = await fetch(`${API_URL}/promotions`);

  return response.json();
}

export async function getAdminPromotions() {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(
    `${API_URL}/promotions/admin/all`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.json();
}

export async function createAdminPromotion(promotionData) {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(
    `${API_URL}/promotions/admin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(promotionData)
    }
  );

  return response.json();
}

export async function toggleAdminPromotion(id) {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(
    `${API_URL}/promotions/admin/${id}/toggle`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.json();
}

export async function deleteAdminPromotion(id) {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(
    `${API_URL}/promotions/admin/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.json();
}

/* ===========================
   SERVICES
=========================== */

export async function getPublicServices() {
  const response = await fetch(`${API_URL}/services`);

  return response.json();
}

export async function getAdminServices() {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(
    `${API_URL}/services/admin/all`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.json();
}

export async function createAdminService(serviceData) {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(
    `${API_URL}/services/admin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(serviceData)
    }
  );

  return response.json();
}

export async function toggleAdminService(id) {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(
    `${API_URL}/services/admin/${id}/toggle`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.json();
}

export async function deleteAdminService(id) {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(
    `${API_URL}/services/admin/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.json();
}

/* ===========================
   ADMIN NOTIFICATIONS
=========================== */

export async function getUnreadNotificationsCount() {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(
    `${API_URL}/admin/notifications/count`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.json();
}

export async function markNotificationsViewed() {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(
    `${API_URL}/admin/notifications/mark-viewed`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.json();
}