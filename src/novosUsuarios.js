async function criarStaff(e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const papelUI = document.getElementById("papel").value;
  const avatarUrl = document.getElementById("avatar_url").value.trim();

  // Mapeia o valor do <select> para o enum do banco
  const papel =
    papelUI === "administrador"
      ? "admin"
      : papelUI === "bibliotecario"
        ? "bibliotecario"
        : null;

  if (!papel) {
    return mostrarAlerta(
      "Papel inválido. Use 'admin' ou 'bibliotecario'.",
      "erro",
    );
  }

  const { data, error } = await db.functions.invoke("criar-staff", {
    body: { nome, email, papel, avatar_url: avatarUrl || null },
  });

  if (error) {
    console.error(error);
    // O corpo do erro vem dentro de data (se houver)
    const msg = data?.error ?? error.message ?? "Erro ao criar usuário.";
    return mostrarAlerta(msg, "erro");
  }

  mostrarAlerta(data.mensagem ?? "Usuário criado!", "sucesso");

  // Se veio senha gerada, mostra pra copiar
  if (data.senha_gerada) {
    alert(
      `Senha temporária de ${email}:\n\n${data.senha_gerada}\n\n` +
        `Copie agora — não será exibida novamente.`,
    );
  }

  // Atualiza preview / limpa form
  resetarFormulario?.();
}
