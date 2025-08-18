const API_URL = "https://api.stellarsightings.app";

// Login function
export async function login(email, password) {
  const params = new URLSearchParams();
  params.append("username", email);
  params.append("password", password);

  const res = await fetch(`${API_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Registration failed");
  }

  const data = await res.json();
  localStorage.setItem("token", data.access_token);
  return data;
}

// registration endpoint
export async function register(email, password) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Registration failed");
  }

  return await res.json();
}

// authentication check
export async function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const res = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;

  return await res.json();
}

// logout.
export function logout() {
  localStorage.removeItem("token");
}
