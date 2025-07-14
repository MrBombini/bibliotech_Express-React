// Helper to fetch users from API and check credentials
export async function loginWithApi(email, password) {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/users');
    if (!res.ok) throw new Error('No se pudo conectar con el servidor');
    let users = await res.json();
    if (!Array.isArray(users)) users = [users];
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return null;
    // Normaliza el objeto para el contexto de la app
    return {
      name: user.nombre,
      email: user.email,
      role: user.role || 'usuario',
      id: user.id
    };
  } catch (e) {
    return null;
  }
}
