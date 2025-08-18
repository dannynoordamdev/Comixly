const API_URL = "https://api.stellarsightings.app";

// Retrieve info of current logged in user:
export async function userInfo() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const res = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;

  return await res.json();
}
