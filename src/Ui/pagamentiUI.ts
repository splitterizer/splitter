import Swal from "../../node_modules/sweetalert2/src/sweetalert2.js";

import Vacanza from "../Vacanza.js";
import * as vacanzaService from "../service/vacanzeService.js";
import Pagamento from "./../interfaccie/Pagamento.js";

import * as personeUI from "./personeUI.js";
import * as arrayUtility from "../utility/arrayUtility.js";

const nomeListaPagamenti: string = "lista-pagamenti";
const nomeDataListPersone: string = "listPersone";
const nomeInputComboboxEditPersone: string = "persone";
const divisioniPagamentoId: string = "divisioni_pagamento";
const itFormatNumber = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

export function renderListaPagamenti(vacanza: Vacanza) {
  const div = document.getElementById(nomeListaPagamenti);
  div.innerHTML = "";
  div.parentElement.querySelector('[is-title="true"]').textContent =
    "Pagamenti";
  renderForm(vacanza);
  div.appendChild(document.createElement("hr"));

  const h4 = document.createElement("h4");
  h4.id = divisioniPagamentoId;
  div.appendChild(h4);
  popolaDivisioniPagamento(vacanza);
  for (let pagamento of vacanza.pagamenti)
    div.appendChild(createPagamentiElement(pagamento, vacanza));
}

export function popolaDivisioniPagamento(vacanza: Vacanza) {
  if (vacanza.persone.length === 0) return;
  const h4 = document.getElementById(divisioniPagamentoId);
  if (!h4) return;
  const prezzoTotale = arrayUtility.sumArrayProp(vacanza.pagamenti, "prezzo");
  h4.textContent = `Tot spesa: ${itFormatNumber.format(
    prezzoTotale
  )}, a testa: ${itFormatNumber.format(prezzoTotale / vacanza.persone.length)}`;
}

/**
 *
 * @param pagamento
 * @param vacanza
 * @returns elmento card di bootrstrap con le info sul pagamento
 */
function createPagamentiElement(
  pagamento: Pagamento,
  vacanza: Vacanza
): HTMLDivElement {
  const card = document.createElement("div");
  card.classList.add("card");

  const cardHeadr = document.createElement("div");
  cardHeadr.classList.add("card-header");
  cardHeadr.textContent = pagamento.descrizione;
  card.appendChild(cardHeadr);

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body", "text-center");
  card.appendChild(cardBody);

  const blockquote = document.createElement("blockquote");
  blockquote.classList.add("blockquote", "mb-0");
  card.appendChild(blockquote);

  const footer = document.createElement("footer");
  footer.classList.add("blockquote-footer");

  const bold = document.createElement("b");
  bold.textContent = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(pagamento.prezzo);

  footer.textContent = `by ${pagamento.persona.nome} for `;
  footer.appendChild(bold);

  card.appendChild(footer);

  const delBtn = document.createElement("button");
  delBtn.classList.add("btn", "btn-outline-danger", "btn-sm", "mx-5");
  delBtn.textContent = "DEL";
  footer.appendChild(delBtn);

  delBtn.addEventListener("click", async (e) => {
    try {
      const risposta = await Swal.fire({
        title: `Eliminare il pagamento <i>${pagamento.descrizione}</i> fatto da <i>${pagamento.persona.nome}</i> per un ammontare di ${pagamento.prezzo} ?`,
        confirmButtonText: "SI",
        denyButtonText: "NO",
        icon: "question",
        showDenyButton: true,
      });
      if (risposta.isConfirmed) {
        vacanza.removePagamento(pagamento);
        vacanzaService.salva(vacanza);
        renderListaPagamenti(vacanza);
        personeUI.renderListaPersone(vacanza);
        Swal.fire(
          "Eliminato",
          `${pagamento.descrizione} by ${pagamento.persona.nome}`,
          "success"
        );
      }
    } catch (error) {
      Swal.fire("Errore", error.message, "error");
    }
  });

  return card;
}

function renderForm(vacanza: Vacanza): void {
  const form = document.createElement("form");

  const labelPersona = document.createElement("label");
  labelPersona.textContent = "Pagamento effettutato da:";
  labelPersona.htmlFor = nomeInputComboboxEditPersone;
  form.appendChild(labelPersona);

  const inputPersona = <HTMLInputElement>document.createElement("input");
  inputPersona.id = nomeInputComboboxEditPersone;
  inputPersona.placeholder = "Nome Persona pagante";
  inputPersona.type = "text";
  inputPersona.required = true;
  inputPersona.classList.add("form-control");
  inputPersona.setAttribute("list", nomeDataListPersone);

  form.appendChild(inputPersona);

  const firstDivFormFloating = document.createElement("div");
  firstDivFormFloating.classList.add("form-floating");
  form.appendChild(firstDivFormFloating);

  const descrizioneInputEl = <HTMLInputElement>document.createElement("input");
  descrizioneInputEl.type = "text";
  descrizioneInputEl.placeholder = "Descrizione";
  descrizioneInputEl.id = "descrizione";
  descrizioneInputEl.required = true;
  descrizioneInputEl.classList.add("form-control");
  firstDivFormFloating.appendChild(descrizioneInputEl);

  const floatingLabelDescrizioneEl = document.createElement("label");
  floatingLabelDescrizioneEl.htmlFor = descrizioneInputEl.id;
  floatingLabelDescrizioneEl.textContent = "Descrizione Pagamento";
  firstDivFormFloating.appendChild(floatingLabelDescrizioneEl);

  const secondDivFormFloating = document.createElement("div");
  secondDivFormFloating.classList.add("form-floating");
  form.appendChild(secondDivFormFloating);

  const prezzoInputEl = <HTMLInputElement>document.createElement("input");
  prezzoInputEl.type = "number";
  prezzoInputEl.placeholder = "prezzo";
  prezzoInputEl.min = "0";
  prezzoInputEl.step = "0.01";
  prezzoInputEl.id = "prezzo";
  prezzoInputEl.required = true;
  prezzoInputEl.classList.add("form-control");
  secondDivFormFloating.appendChild(prezzoInputEl);

  const floatingLabelPrezzoEl = document.createElement("label");
  floatingLabelPrezzoEl.htmlFor = prezzoInputEl.id;
  floatingLabelPrezzoEl.textContent = "prezzo";
  secondDivFormFloating.appendChild(floatingLabelPrezzoEl);

  const submitBtn = document.createElement("input");
  submitBtn.type = "submit";
  submitBtn.value = "Aggiungi";
  submitBtn.classList.add("btn", "btn-secondary");
  form.appendChild(submitBtn);

  form.addEventListener("submit", (e) => {
    console.debug("invato x pagamento..");
    e.preventDefault();
    try {
      vacanza.addPagamento(
        descrizioneInputEl.value,
        prezzoInputEl.valueAsNumber,
        inputPersona.value
      );
      personeUI.renderListaPersone(vacanza);
      vacanzaService.salva(vacanza);
      renderListaPagamenti(vacanza);
    } catch (error) {
      Swal.fire("Errore", error.message, "error");
    }

    console.debug(vacanza.getDivisioneSpese());
  });

  document.getElementById(nomeListaPagamenti).append(form);
  renderDatalistpersone(vacanza);
}

/**
 * popola i valori possibili delle persone nel form per i pagamenti
 * @param vacanza vacanza in questione
 */
export function renderDatalistpersone(vacanza: Vacanza) {
  let dataListPersoneEl = document.getElementById(nomeDataListPersone);
  if (!dataListPersoneEl) {
    dataListPersoneEl = document.createElement("datalist");
    dataListPersoneEl.id = nomeDataListPersone;
    document
      .getElementById(nomeInputComboboxEditPersone)
      .appendChild(dataListPersoneEl);
  }
  dataListPersoneEl.innerHTML = "";

  vacanza.persone.forEach((persona) => {
    const option = <HTMLOptionElement>document.createElement("option");
    option.value = persona.nome;
    option.textContent = persona.nome;
    dataListPersoneEl.appendChild(option);
  });
}
