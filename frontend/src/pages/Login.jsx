async function handleSubmit(e){
  e.preventDefault();
  setMsg("");
  setLoading(true);
  try {
    const data = await postJson("/auth/login", { email, password });

    // pega os campos do backend
    const token = data.token;         // string
    const tokenType = data.tokenType; // "Bearer"
    const role = data.role;           // "OWNER" | "SITTER"
    const userEmail = data.email;

    // salva no localStorage (ou outro state manager, se quiser)
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("email", userEmail);

    setMsg("Login realizado!");
    setTimeout(() => navigate("/dashboard"), 400);
  } catch (err) {
    setMsg(err.message || "Erro ao entrar");
  } finally {
    setLoading(false);
  }
}