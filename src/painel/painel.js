import { estaLogado } from "../auth/checarSessao.js";
import { exigirPapel } from "../auth/exigirPapel.js";
import { navigate } from "../common/modules/navigate.js";
import { carregarUsuario, salvarPerfil } from "./modules/perfil.js";
import { renovarLivro } from "./modules/renovarLivro.js";

// Proteção: sem sessão ou sem papel, volta para o login
if (!(await estaLogado())) {
  window.location.href = "login.html";
  throw new Error("Usuário não logado");
}

if (!(await exigirPapel(["leitor"]))) {
  window.location.href = "login.html";
  throw new Error("Papel não permitido");
}

const usuario = Sessao.obterUsuario(); // ajuste para o método real do seu common.js
carregarUsuario(usuario);
Sessao.exibirMensagemGuardada();

document.addEventListener("click", async (e) => {

  const nav = e.target.closest("[data-navigate]");
  if (nav) {
    e.preventDefault();
    navigate(nav.dataset.navigate);
    return;
  }

  const acao = e.target.closest("[data-action]");
  if (!acao) return;

  switch (acao.dataset.action) {
    case "sair":
      await sair();
      break;
    case "renovar-livro":
      renovarLivro(acao.dataset.livro, acao);
      break;
  }
});

document
  .getElementById("form-perfil")
  .addEventListener("submit", (e) => salvarPerfil(e, usuario));
