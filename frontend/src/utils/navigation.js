// src/utils/navigation.js
export function handleRedirectByRole(session, navigate) {
  if (!session || !navigate) return;

  const role = (session?.role || "").toUpperCase();

  if (role === "OWNER") navigate("/owner/dashboard", { replace: true });
  else if (role === "SITTER") navigate("/sitter/dashboard", { replace: true });
  else if (role === "ADMIN") navigate("/admin/dashboard", { replace: true });
  else navigate("/", { replace: true });
}