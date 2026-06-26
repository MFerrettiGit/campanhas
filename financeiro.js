/* financeiro.js — Planilha consolidada de prêmios para o FINANCEIRO (M. Ferretti).
   Espelha o modelo "PRÊMIOS PAGAMENTO": aba RESUMO (junção por pessoa, 1 coluna por
   campanha + TOTAL) + uma aba de detalhe por campanha.

   ⚠️ FONTE ÚNICA deste arquivo. Ao atualizar os números de uma campanha no site
   (campanhas/<slug>.html), atualize também o ranking/regionais correspondente AQUI.

   Acesso restrito: o botão "Planilha do financeiro" só aparece para os acessos com
   fin:true (senhas Gil26 / Gui26 / Marcio26). */
(function () {
  "use strict";

  var FIN = {
    titulo: "PRÊMIOS — PAGAMENTO",
    periodo: "Junho e Julho / 2026",
    pagamento: "Até 20/08/2026 — no Cartão Premiação",
    apuradoAte: "12/06/2026 (parcial)",
    // Pessoas canônicas (setor -> tipo, nome). Ordem alfabética por setor (igual ao modelo).
    pessoas: [
      { setor: "Americana",        tipo: "VENDEDOR",      nome: "MAIRA" },
      { setor: "Atibaia",          tipo: "VENDEDOR",      nome: "EUGÊNIO" },
      { setor: "Campinas Norte",   tipo: "VENDEDOR",      nome: "ALAN" },
      { setor: "Caraguatatuba",    tipo: "VENDEDOR",      nome: "KARINA" },
      { setor: "Circuito",         tipo: "VENDEDOR",      nome: "RACHEL" },
      { setor: "Contas Chaves",    tipo: "VENDEDOR",      nome: "EDUARDO" },
      { setor: "Franca",           tipo: "VENDEDOR",      nome: "LUIS" },
      { setor: "Indaiatuba",       tipo: "VENDEDOR",      nome: "LUCAS" },
      { setor: "Itapetininga",     tipo: "VENDEDOR",      nome: "NELSON" },
      { setor: "Jundiaí",          tipo: "VENDEDOR",      nome: "CASTRO" },
      { setor: "Ribeirão Preto",   tipo: "VENDEDOR",      nome: "FERNANDO" },
      { setor: "Rio Claro",        tipo: "VENDEDOR",      nome: "COSTINHA" },
      { setor: "S.J. Boa Vista",   tipo: "REPRESENTANTE", nome: "CELIA" },
      { setor: "S.J. dos Campos",  tipo: "VENDEDOR",      nome: "MARIÂNGELA" },
      { setor: "São Carlos",       tipo: "VENDEDOR",      nome: "BRAGATTO" },
      { setor: "Setor Piracicaba", tipo: "VENDEDOR",      nome: "COMINATO" },
      { setor: "Sorocaba",         tipo: "REPRESENTANTE", nome: "MAURICIO" }
    ],
    gestores: [
      { area: "NORDESTE", tipo: "GESTOR", nome: "LOPES" },
      { area: "SUL",      tipo: "GESTOR", nome: "RANGEL" }
    ],
    gerente: { area: "GERÊNCIA", tipo: "GERENTE", nome: "PAULO" },
    // Campanhas (ordem das colunas no RESUMO).
    campanhas: [
      {
        key: "BARUEL", nome: "Baruel Baby", modelo: "positivacoes", base: "Positivações",
        mecanica: [
          "Positivação = pedido que contém o item. São 3 rankings (Shampoo Suave, Refil Glicerina, Sabonete Refil); prêmio fixo por posição em cada ranking: 1º R$ 600, 2º R$ 500, 3º R$ 400, 4º R$ 300, 5º R$ 200, 6º R$ 150.",
          "Gatilho: mínimo de 40 positivações no bimestre de cada item. Supervisor: R$ 600 à regional líder de cada item. Valores PREVISTOS — campanha em andamento."
        ],
        ranking: [
          { setor: "Caraguatatuba", regional: "SUL", vendas: 28, premio: 1600 },
          { setor: "Americana", regional: "NORDESTE", vendas: 24, premio: 1400 },
          { setor: "S.J. Boa Vista", regional: "NORDESTE", vendas: 25, premio: 1200 },
          { setor: "Circuito", regional: "NORDESTE", vendas: 16, premio: 700 },
          { setor: "Rio Claro", regional: "NORDESTE", vendas: 15, premio: 550 },
          { setor: "Indaiatuba", regional: "SUL", vendas: 12, premio: 500 },
          { setor: "São Carlos", regional: "NORDESTE", vendas: 12, premio: 200 },
          { setor: "S.J. dos Campos", regional: "SUL", vendas: 13, premio: 150 },
          { setor: "Campinas Norte", regional: "SUL", vendas: 9, premio: 150 },
          { setor: "Ribeirão Preto", regional: "NORDESTE", vendas: 10, premio: 0 },
          { setor: "Franca", regional: "NORDESTE", vendas: 8, premio: 0 },
          { setor: "Sorocaba", regional: "SUL", vendas: 7, premio: 0 },
          { setor: "Setor Piracicaba", regional: "NORDESTE", vendas: 5, premio: 0 },
          { setor: "Atibaia", regional: "SUL", vendas: 3, premio: 0 },
          { setor: "Jundiaí", regional: "SUL", vendas: 1, premio: 0 },
          { setor: "Itapetininga", regional: "SUL", vendas: 0, premio: 0 }
        ],
        regionais: [
          { area: "NORDESTE", vendas: 115, premio: 1800 },
          { area: "SUL", vendas: 73, premio: 0 }
        ],
        gerencia: null
      },
      {
        key: "FARNESE", nome: "Farnese Biocare", modelo: "caixa", base: "Caixas",
        mecanica: [
          "Prêmio por caixa conforme a classificação por % da carteira do setor (1º-3º R$ 18/cx … 14º-16º R$ 10/cx) + Conta-Chave (R$ 500 por cliente novo).",
          "Aguardando apuração — ainda sem dados."
        ],
        ranking: [],
        regionais: [],
        gerencia: null
      }
    ]
  };

  // ---------- utilitários ----------
  var norm = function (s) {
    return (s || "").toString().toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Z0-9]/g, "");
  };
  var premioSetor = function (camp, setor) {
    var k = norm(setor);
    var row = camp.ranking.find(function (x) { return norm(x.setor) === k; });
    return row ? (row.premio || 0) : 0;
  };
  var premioGestor = function (camp, area) {
    var row = (camp.regionais || []).find(function (x) { return norm(x.area) === norm(area); });
    return row ? (row.premio || 0) : 0;
  };
  var premioGerente = function (camp) { return camp.gerencia ? (camp.gerencia.premio || 0) : 0; };
  var nomeSetor = function (setor) {
    var k = norm(setor);
    var p = FIN.pessoas.find(function (x) { return norm(x.setor) === k; });
    return p ? p.nome : setor;
  };

  var _exceljsPromise = null;
  function loadExcelJS() {
    if (window.ExcelJS) return Promise.resolve();
    if (_exceljsPromise) return _exceljsPromise;
    _exceljsPromise = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js";
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error("Não foi possível carregar a biblioteca de exportação (sem internet?).")); };
      document.head.appendChild(s);
    });
    return _exceljsPromise;
  }

  // ---------- montagem do workbook ----------
  var AZUL = "FF2B2FA8", LIGHT = "FFEEF0FF", ZEBRA = "FFF7F8FE", WIN = "FFEAFBF0",
      TOTAL = "FFE6ECFF", GREEN = "FF1F9D45", MUTED = "FF6B6F8A", LINE = "FFE0E3F0", WHITE = "FFFFFFFF",
      RED = "FFFAD4D4", REDTX = "FFB02A37";
  var FMT_MONEY = '"R$"\\ #,##0.00', FMT_INT = "#,##0";

  function styleHelpers(ws) {
    var H = {};
    H.fill = function (cell, argb) { cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: argb } }; };
    H.thin = function (cell) { var b = { style: "thin", color: { argb: LINE } }; cell.border = { top: b, bottom: b, left: b, right: b }; };
    return H;
  }

  function buildResumo(wb) {
    var ws = wb.addWorksheet("RESUMO", { views: [{ showGridLines: false }], pageSetup: { fitToPage: true, fitToWidth: 1, fitToHeight: 0, orientation: "portrait" } });
    var H = styleHelpers(ws);
    var camps = FIN.campanhas;
    var NC = 4 + camps.length; // SETOR, VEND/REPRE, NOME, [campanhas], TOTAL
    var widths = [22, 16, 16].concat(camps.map(function () { return 14; })).concat([15]);
    widths.forEach(function (w, i) { ws.getColumn(i + 1).width = w; });

    var r = 1;
    var mergeAll = function (val, opts) { ws.mergeCells(r, 1, r, NC); var c = ws.getCell(r, 1); c.value = val; Object.assign(c, opts || {}); return c; };

    var c = mergeAll(FIN.titulo + "  ·  " + FIN.periodo, { font: { size: 16, bold: true, color: { argb: WHITE } }, alignment: { vertical: "middle", horizontal: "center" } });
    H.fill(c, AZUL); ws.getRow(r).height = 28; r++;
    mergeAll("Consolidado de prêmios — M. Ferretti Distribuidora", { font: { italic: true, color: { argb: MUTED } }, alignment: { horizontal: "center" } }); r++;
    mergeAll("Pagamento: " + FIN.pagamento + "  ·  Resultado apurado até " + FIN.apuradoAte, { font: { italic: true, color: { argb: MUTED } }, alignment: { horizontal: "center" } }); r += 2;

    // Cabeçalho da tabela
    var head = ["SETOR", "VEND/REPRE", "NOME"].concat(camps.map(function (k) { return k.nome.toUpperCase(); })).concat(["TOTAL"]);
    head.forEach(function (t, i) {
      var cc = ws.getCell(r, i + 1); cc.value = t; cc.font = { bold: true, color: { argb: AZUL } }; H.fill(cc, LIGHT); H.thin(cc);
      cc.alignment = { horizontal: (i >= 3 ? "right" : "left") };
    });
    r++;

    var colTotals = camps.map(function () { return 0; });
    var grand = 0;

    function emitRow(setorTxt, tipo, nome, vals, opts) {
      var rowTotal = vals.reduce(function (a, b) { return a + b; }, 0);
      var line = [setorTxt, tipo, nome].concat(vals).concat([rowTotal]);
      line.forEach(function (v, ci) {
        var cc = ws.getCell(r, ci + 1);
        if (ci >= 3) { cc.value = v === 0 ? "" : v; cc.numFmt = FMT_MONEY; cc.alignment = { horizontal: "right" }; }
        else { cc.value = v; cc.alignment = { horizontal: "left" }; }
        H.thin(cc);
        if (opts && opts.fill) H.fill(cc, opts.fill);
        else if (opts && opts.zebra) H.fill(cc, ZEBRA);
        if (ci === NC - 1) cc.font = { bold: true, color: { argb: rowTotal > 0 ? GREEN : MUTED } };
        if (opts && opts.bold && ci < 3) cc.font = { bold: true };
      });
      vals.forEach(function (v, i) { colTotals[i] += v; });
      grand += rowTotal;
      r++;
    }

    // Vendedores / representantes
    FIN.pessoas.forEach(function (p, idx) {
      var vals = camps.map(function (camp) { return premioSetor(camp, p.setor); });
      emitRow(p.setor.toUpperCase(), p.tipo, p.nome, vals, { zebra: idx % 2 === 1 });
    });
    // Gestores
    FIN.gestores.forEach(function (g) {
      var vals = camps.map(function (camp) { return premioGestor(camp, g.area); });
      emitRow(g.area, g.tipo, g.nome, vals, { fill: "FFF0F4FF", bold: true });
    });
    // Gerência
    var gv = camps.map(function (camp) { return premioGerente(camp); });
    emitRow(FIN.gerente.area, FIN.gerente.tipo, FIN.gerente.nome, gv, { fill: "FFF0F4FF", bold: true });

    // TOTAL
    var totLine = ["TOTAL", "", ""].concat(colTotals).concat([grand]);
    totLine.forEach(function (v, ci) {
      var cc = ws.getCell(r, ci + 1);
      if (ci >= 3) { cc.value = v; cc.numFmt = FMT_MONEY; cc.alignment = { horizontal: "right" }; }
      else { cc.value = v; cc.alignment = { horizontal: "left" }; }
      H.thin(cc); H.fill(cc, TOTAL); cc.font = { bold: true, size: 11 };
    });
    r += 2;
    mergeAll("Coluna por campanha = prêmio do colaborador naquela campanha. TOTAL = soma das campanhas no período.", { font: { italic: true, color: { argb: MUTED } } });
  }

  function buildDetalhe(wb, camp) {
    var CAIXA = camp.modelo === "caixa";
    var POS = camp.modelo === "positivacoes";
    var BASEFMT = POS ? FMT_INT : FMT_MONEY;
    var ws = wb.addWorksheet(camp.nome.toUpperCase().substring(0, 31), { views: [{ showGridLines: false }], pageSetup: { fitToPage: true, fitToWidth: 1, fitToHeight: 0, orientation: "portrait" } });
    var H = styleHelpers(ws);
    var head = CAIXA
      ? ["Regional", "Setor", "Nome", "Caixas 1 L", "Caixas 500 ML", "Total cx", "Prêmio", "Motivo"]
      : ["Regional", "Setor", "Nome", camp.base, "Prêmio", "Motivo"];
    var widths = CAIXA ? [14, 20, 16, 12, 14, 11, 15, 30] : [14, 20, 16, 16, 15, 30];
    var NC = head.length;
    widths.forEach(function (w, i) { ws.getColumn(i + 1).width = w; });

    var r = 1;
    var mergeAll = function (val, opts) { ws.mergeCells(r, 1, r, NC); var c = ws.getCell(r, 1); c.value = val; Object.assign(c, opts || {}); return c; };

    var c = mergeAll("Concurso " + camp.nome + " — " + FIN.periodo, { font: { size: 14, bold: true, color: { argb: WHITE } }, alignment: { vertical: "middle", horizontal: "center" } });
    H.fill(c, AZUL); ws.getRow(r).height = 24; r++;
    camp.mecanica.forEach(function (m) { mergeAll(m, { font: { italic: true, color: { argb: MUTED } }, alignment: { wrapText: true, vertical: "top" } }); ws.getRow(r).height = 26; r++; });
    r++;

    head.forEach(function (t, i) {
      var cc = ws.getCell(r, i + 1); cc.value = t; cc.font = { bold: true, color: { argb: AZUL } }; H.fill(cc, LIGHT); H.thin(cc);
      cc.alignment = { horizontal: (i >= 3 && i < NC - 1 ? "right" : "left") };
    });
    r++;

    var rankSorted = camp.ranking.slice().sort(function (a, b) { return (b.premio || 0) - (a.premio || 0); });
    var PCOL = CAIXA ? 6 : 4, MCOL = NC - 1;
    var motivoFn = function (rr) {
      if ((rr.premio || 0) > 0) return "";
      if (camp.modelo === "faturamento") return "Vendas abaixo da faixa mínima (R$ 3.500,00)";
      if (camp.modelo === "positivacoes") return "Fora do top 6 do produto / abaixo do gatilho";
      return "Não atingiu o prêmio mínimo (R$ 200,00)";
    };
    var t1 = 0, t5 = 0, tv = 0, tp = 0;
    rankSorted.forEach(function (rr, i) {
      var win = (rr.premio || 0) > 0;
      var vals = (CAIXA
        ? [rr.regional, rr.setor, nomeSetor(rr.setor), rr.cx1, rr.cx5, (rr.cx1 + rr.cx5), rr.premio]
        : [rr.regional, rr.setor, nomeSetor(rr.setor), rr.vendas, rr.premio]).concat([motivoFn(rr)]);
      t1 += rr.cx1 || 0; t5 += rr.cx5 || 0; tv += rr.vendas || 0; tp += rr.premio || 0;
      vals.forEach(function (v, ci) {
        var cc = ws.getCell(r, ci + 1); cc.value = v; H.thin(cc);
        var isMoneyCol = ci >= 3 && ci < MCOL;
        cc.alignment = { horizontal: (isMoneyCol ? "right" : "left"), wrapText: (ci === MCOL) };
        if (win) H.fill(cc, WIN); else H.fill(cc, RED);
        if (CAIXA) { if (ci >= 3 && ci <= 5) cc.numFmt = FMT_INT; } else { if (ci === 3) cc.numFmt = BASEFMT; }
        if (ci === PCOL) { cc.numFmt = FMT_MONEY; cc.font = { bold: true, color: { argb: win ? GREEN : REDTX } }; }
        if (ci === MCOL && !win) { cc.font = { italic: true, color: { argb: REDTX } }; }
      });
      r++;
    });
    var totRow = (CAIXA ? ["TOTAL", "", "", t1, t5, (t1 + t5), tp] : ["TOTAL", "", "", tv, tp]).concat([""]);
    totRow.forEach(function (v, ci) {
      var cc = ws.getCell(r, ci + 1); cc.value = v; H.thin(cc); H.fill(cc, TOTAL); cc.font = { bold: true }; cc.alignment = { horizontal: (ci >= 3 ? "right" : "left") };
      if (CAIXA) { if (ci >= 3 && ci <= 5) cc.numFmt = FMT_INT; if (ci === 6) cc.numFmt = FMT_MONEY; } else { if (ci === 3) cc.numFmt = BASEFMT; if (ci === 4) cc.numFmt = FMT_MONEY; }
    });
    r += 2;

    // Premiação por regional + gerência
    var regs = (camp.regionais || []).slice();
    if (regs.length || camp.gerencia) {
      var rc = mergeAll("PREMIAÇÃO POR REGIONAL / GERÊNCIA", { font: { bold: true, size: 11, color: { argb: WHITE } } }); H.fill(rc, AZUL); ws.getRow(r).height = 18; r++;
      var rh = CAIXA ? ["Gestor", "Regional", "Caixas 1 L", "Caixas 500 ML", "Total cx", "Prêmio"] : ["Gestor", "Regional", camp.base, "Prêmio"];
      rh.forEach(function (t, i) { var cc = ws.getCell(r, i + 1); cc.value = t; cc.font = { bold: true, color: { argb: AZUL } }; H.fill(cc, LIGHT); H.thin(cc); cc.alignment = { horizontal: (i >= 2 ? "right" : "left") }; });
      r++;
      var gestNome = function (area) { var g = FIN.gestores.find(function (x) { return norm(x.area) === norm(area); }); return g ? g.nome : area; };
      regs.forEach(function (rg) {
        var vals = CAIXA ? [gestNome(rg.area), rg.area, rg.cx1, rg.cx5, (rg.cx1 + rg.cx5), rg.premio] : [gestNome(rg.area), rg.area, rg.vendas, rg.premio];
        vals.forEach(function (v, ci) {
          var cc = ws.getCell(r, ci + 1); cc.value = v; H.thin(cc); cc.alignment = { horizontal: (ci >= 2 ? "right" : "left") };
          if (CAIXA) { if (ci >= 2 && ci <= 4) cc.numFmt = FMT_INT; if (ci === 5) { cc.numFmt = FMT_MONEY; cc.font = { bold: true, color: { argb: rg.premio > 0 ? GREEN : MUTED } }; } }
          else { if (ci === 2) cc.numFmt = BASEFMT; if (ci === 3) { cc.numFmt = FMT_MONEY; cc.font = { bold: true, color: { argb: rg.premio > 0 ? GREEN : MUTED } }; } }
        });
        r++;
      });
      if (camp.gerencia) {
        var gv2 = CAIXA ? [FIN.gerente.nome, "GERÊNCIA", "", "", "", camp.gerencia.premio] : [FIN.gerente.nome, "GERÊNCIA", camp.gerencia.vendas, camp.gerencia.premio];
        gv2.forEach(function (v, ci) {
          var cc = ws.getCell(r, ci + 1); cc.value = v; H.thin(cc); cc.alignment = { horizontal: (ci >= 2 ? "right" : "left") };
          if (CAIXA) { if (ci === 5) { cc.numFmt = FMT_MONEY; cc.font = { bold: true, color: { argb: GREEN } }; } }
          else { if (ci === 2) cc.numFmt = FMT_MONEY; if (ci === 3) { cc.numFmt = FMT_MONEY; cc.font = { bold: true, color: { argb: GREEN } }; } }
        });
        r++;
      }
    }
  }

  async function gerarFinanceiroXlsx() {
    var btn = document.getElementById("finBtn");
    var txt = btn ? btn.textContent : "";
    try {
      if (btn) { btn.disabled = true; btn.textContent = "Gerando…"; }
      await loadExcelJS();
      var wb = new ExcelJS.Workbook();
      wb.creator = "M. Ferretti Distribuidora";
      buildResumo(wb);
      FIN.campanhas.forEach(function (camp) { buildDetalhe(wb, camp); });
      var buf = await wb.xlsx.writeBuffer();
      var blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      var nome = ("PRÊMIOS PAGAMENTO - " + FIN.periodo).replace(/[\\/:*?"<>|]/g, "").trim() + ".xlsx";
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = nome; document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    } catch (e) {
      alert(e && e.message ? e.message : "Falha ao gerar a planilha do financeiro.");
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = txt; }
    }
  }

  window.FIN = FIN;
  window.gerarFinanceiroXlsx = gerarFinanceiroXlsx;
})();
