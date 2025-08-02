// src/utils/authFetch.js
export async function authFetch(url, options = {}, navigate) {
    const token = localStorage.getItem('token');
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  
    const res = await fetch(url, { ...options, headers });
    let data = {};
    try {
      data = await res.json();
    } catch (e) {
      // Not JSON (handle as needed)
    }
  
    if (!res.ok) {
      if (data?.msg?.toLowerCase().includes('token') || res.status === 401) {
        // Token invalid or expired
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        if (navigate) navigate('/login');
        else window.location.href = '/login';
        return null;
      }
      throw new Error(data.msg || 'Something went wrong');
    }
    return data;
  }
  