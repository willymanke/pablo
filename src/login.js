async function redirecionarPorPapel(userId) {
  const { data, error } = await db
    .from("profiles")
    .select("papel")
    .eq("id", userId)
    .single();

  if (error || !data) {
    console.error("Erro ao ler perfil:", error);
    window.location.replace("index.html"); // fallback seguro
    return;
  }

  if (data.papel === "admin" || data.papel === "bibliotecario") {
    window.location.replace("painelAdministrativo.html");
  } else {
    window.location.replace("painel.html");
  }
}

// Se já estiver logado, vai direto para o painel
async function verificarSessao() {
  const {
    data: { session },
  } = await db.auth.getSession();

  if (session) {
    await redirecionarPorPapel(session.user.id);
  }
}

// Executa ao carregar a página
//verificarSessao();

async function fazerLogin(e) {
  e.preventDefault();

  const login = document.getElementById("user-login").value.trim();
  const senha = document.getElementById("user-pass").value;

  if (!login || !senha) {
    mostrarAlerta("Preencha e-mail e senha.", "erro");
    return;
  }

  // Login REAL pelo Supabase Auth
  const { data, error } = await db.auth.signInWithPassword({
    email: login,
    password: senha,
  });

  if (error) {
    console.error("Erro no login:", error);

    mostrarAlerta("E-mail ou senha inválidos.", "erro");

    return;
  }

  console.log("Login realizado:", data.user);

  mostrarAlerta("Login realizado com sucesso!", "sucesso");

  await redirecionarPorPapel(data.user.id);
}
