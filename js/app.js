/* Monta a página a partir de dados/tema.js, dados/redes.js e dados/site.js.
   Não é preciso editar este arquivo para trocar o tema ou os links. */
(function () {
  "use strict";

  var tema = window.SITE_TEMA || {};
  var redes = Array.isArray(window.SITE_REDES) ? window.SITE_REDES : [];
  var info = window.SITE_INFO || {};
  var icones = window.SITE_ICONES || {};

  var PROTOCOLOS_PERMITIDOS = ["http:", "https:", "mailto:", "tel:"];
  var MARCAS_PLACEHOLDER = /SEU_|SUBSTITUIR|exemplo\.com/i;

  /** Aceita só http(s), mailto e tel; qualquer outro valor vira "#". */
  function linkSeguro(valor) {
    if (typeof valor !== "string" || valor.trim() === "") return "#";
    try {
      var url = new URL(valor, window.location.href);
      return PROTOCOLOS_PERMITIDOS.indexOf(url.protocol) >= 0 ? url.href : "#";
    } catch (erro) {
      return "#";
    }
  }

  function ehExterno(href) {
    return /^https?:/i.test(href);
  }

  function texto(valor) {
    return typeof valor === "string" ? valor.trim() : "";
  }

  /** Cria elemento com classe e texto (sempre via textContent, nunca HTML). */
  function el(tag, classe, conteudo) {
    var no = document.createElement(tag);
    if (classe) no.className = classe;
    if (conteudo) no.textContent = conteudo;
    return no;
  }

  function prepararLink(a, href) {
    a.href = href;
    if (ehExterno(href)) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
  }

  function preencher(id, valor) {
    var alvo = document.getElementById(id);
    if (!alvo) return;
    var t = texto(valor);
    alvo.textContent = t;
    alvo.hidden = t === "";
  }

  /* ---------- Cabeçalho e rodapé ---------- */
  function montarMarca() {
    var logo = document.getElementById("marca-logo");
    if (texto(info.logo)) {
      logo.src = info.logo;
      logo.alt = texto(info.logoAlt) || texto(info.nome);
      logo.hidden = false;
      logo.addEventListener("error", function () { logo.hidden = true; });
    }
    preencher("marca-nome", info.nome);
    preencher("marca-sub", info.subtitulo);
    preencher("rodape-nome", info.instituicao || info.nome);
    preencher("rodape-texto", info.rodape);
    preencher("rodape-ano-nome", info.logoAlt || info.nome);
    var rodapeLogo =document.getElementById("rodape-logo");
    if (texto(info.logo)) {
      rodapeLogo.src = info.logo;
      rodapeLogo.hidden = false;
    }
    var tituloPagina = texto(info.tituloPagina) || (texto(info.nome) && texto(info.nome) + " · Redes sociais");
    if (tituloPagina) document.title = tituloPagina;
  }

  function montarContato() {
    var lista = document.getElementById("contato-lista");
    var c = info.contato || {};
    var itens = [
      { rotulo: "Telefone", icone: "telefone", valor: texto(c.telefone), href: texto(c.telefone) && "tel:" + texto(c.telefone).replace(/[^\d+]/g, "") },
      { rotulo: "Site", icone: "site", valor: texto(c.site).replace(/^https?:\/\//, "").replace(/\/$/, ""), href: texto(c.site) },
      { rotulo: "E-mail", icone: "email", valor: texto(c.email), href: texto(c.email) && "mailto:" + texto(c.email).replace(/[\[\]]/g, "") },
      { rotulo: "Endereço", icone: "local", valor: texto(c.endereco), href: "" }
    ];
    itens.forEach(function (item) {
      if (!item.valor) return;
      var li = el("li", "contato-item contato-" + item.icone);
      var alvo = item.href ? el("a", "contato-valor") : el("span", "contato-valor");
      alvo.appendChild(criarIcone(item.icone, "contato-icone"));
      alvo.appendChild(el("span", "visualmente-oculto", item.rotulo + ": "));
      alvo.appendChild(el("span", "", item.valor));
      if (item.href) {
        prepararLink(alvo, linkSeguro(item.href));
        if (ehExterno(alvo.href)) alvo.appendChild(el("span", "visualmente-oculto", " (abre em nova aba)"));
      }
      li.appendChild(alvo);
      lista.appendChild(li);
    });
    document.getElementById("contato").hidden = lista.children.length === 0;
  }

  /* ---------- Destaque (tema) ---------- */
  function montarTema() {
    preencher("tema-etiqueta", tema.etiqueta);
    preencher("tema-periodo", tema.periodo);
    var meta = document.getElementById("tema-meta");
    meta.hidden = !texto(tema.etiqueta) && !texto(tema.periodo);

    var titulo = document.getElementById("tema-titulo");
    titulo.textContent = texto(tema.titulo);
    if (texto(tema.tituloDestaque)) {
      titulo.appendChild(document.createTextNode(" "));
      titulo.appendChild(el("span", "titulo-destaque", texto(tema.tituloDestaque)));
    }

    preencher("tema-descricao", tema.descricao);
    montarDadosTema();

    var img = document.getElementById("tema-imagem");
    if (texto(tema.imagem)) {
      img.src = tema.imagem;
      img.alt = texto(tema.imagemAlt);
      if (tema.imagemFormato === "retrato") img.closest(".destaque-midia").classList.add("retrato");
    } else {
      img.closest(".destaque-midia").hidden = true;
    }

    var botao = document.getElementById("tema-botao");
    var rotulo = texto(tema.botaoTexto);
    if (rotulo) {
      document.getElementById("tema-botao-texto").textContent = rotulo;
      prepararLink(botao, linkSeguro(tema.botaoLink));
      if (ehExterno(botao.href)) botao.setAttribute("aria-label", rotulo + " (abre em nova aba)");
    } else {
      botao.hidden = true;
    }
  }

  function montarDadosTema() {
    var lista = document.getElementById("tema-dados");
    var dados = Array.isArray(tema.dados) ? tema.dados : [];
    dados.forEach(function (d) {
      if (!d || !texto(d.valor)) return;
      var li = el("li");
      li.appendChild(el("span", "dado-valor", texto(d.valor)));
      if (texto(d.texto)) li.appendChild(el("span", "dado-texto", texto(d.texto)));
      lista.appendChild(li);
    });
    lista.hidden = lista.children.length === 0;
  }

  /* ---------- Redes sociais ---------- */
  function criarIcone(nome, classe) {
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    if (classe) svg.setAttribute("class", classe);
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    // Conteúdo fixo vindo de js/icones.js (não editável pelo usuário).
    svg.innerHTML = icones[nome] || icones.site;
    return svg;
  }

  function criarCartao(rede) {
    var href = linkSeguro(rede.link);
    var plataforma = texto(rede.plataforma) || "Rede social";
    var li = el("li");
    var a = el("a", "rede");
    prepararLink(a, href);
    a.setAttribute("data-rede", texto(rede.icone) || "site");

    var icone = el("span", "rede-icone");
    icone.appendChild(criarIcone(texto(rede.icone)));
    a.appendChild(icone);

    var corpo = el("span", "rede-corpo");
    corpo.appendChild(el("span", "rede-nome", plataforma));
    if (texto(rede.perfil)) corpo.appendChild(el("span", "rede-perfil", texto(rede.perfil)));
    a.appendChild(corpo);

    var ehExemplo = MARCAS_PLACEHOLDER.test(rede.link || "");
    if (ehExemplo) a.appendChild(el("span", "rede-exemplo", "exemplo"));

    var seta = el("span", "rede-seta");
    seta.setAttribute("aria-hidden", "true");
    seta.textContent = "↗";
    a.appendChild(seta);

    var rotulo = plataforma + (texto(rede.perfil) ? ", " + texto(rede.perfil) : "");
    if (ehExemplo) rotulo += " (link de exemplo)";
    if (ehExterno(href)) rotulo += " (abre em nova aba)";
    a.setAttribute("aria-label", rotulo);

    li.appendChild(a);
    return li;
  }

  function montarRedes() {
    preencher("redes-titulo", info.chamadaRedes || "Nossas redes");
    preencher("redes-texto", info.textoRedes);
    var lista = document.getElementById("redes-lista");
    redes.forEach(function (rede) {
      if (rede && typeof rede === "object") lista.appendChild(criarCartao(rede));
    });
    if (lista.children.length === 0) {
      lista.appendChild(el("li", "redes-vazio", "Nenhuma rede cadastrada em dados/redes.js."));
    }
  }

  document.getElementById("ano").textContent = String(new Date().getFullYear());
  montarMarca();
  montarTema();
  montarRedes();
  montarContato();
  document.documentElement.classList.add("pronto");
})();
