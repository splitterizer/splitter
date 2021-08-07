import Swal from "../../node_modules/sweetalert2/src/sweetalert2.js";

import Persona from "../interfaccie/Persona.js";
import Vacanza from "../Vacanza.js";
import * as vacanzaService from "../service/vacanzeService.js";
import * as pagamentiUi from "./pagamentiUI.js";
import * as arrayUtility from "../utility/arrayUtility.js";

const nomeListaPersona: string = "lista-persone";
const itFormatNumber = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

/**
 *
 * @param vacanza
 */
export function renderListaPersone(vacanza: Vacanza) {
  const div = document.getElementById(nomeListaPersona);
  div.innerHTML = "";
  div.parentElement.querySelector('[is-title="true"]').textContent = "Persone";
  renderForm(vacanza);
  div.appendChild(document.createElement("hr"));
  for (let persona of vacanza.persone)
    div.appendChild(createPersonaElement(persona, vacanza));
}

/**
 *
 * @param persona
 * @param vacanza
 * @returns elmento card di bootrstrap con solo il nome della persona
 */
function createPersonaElement(
  persona: Persona,
  vacanza: Vacanza
): HTMLDivElement {
  const divisioneSpese = vacanza.getDivisioneSpese();
  const transazioni = divisioneSpese.getTransazioni(persona);

  const card = document.createElement("div");
  card.classList.add("card");
  const cardBody = document.createElement("div");
  cardBody.classList.add(
    "card-body",
    "d-flex",
    "align-items-start",
    "justify-content-between"
  );
  const spesaPeronale = arrayUtility.sumArrayProp(
    vacanza.pagamenti.filter((p) => p.persona.nome === persona.nome),
    "prezzo"
  );

  cardBody.innerHTML = `<span class="badge bg-light text-dark"> ${itFormatNumber.format(
    spesaPeronale
  )} </span><b>${persona.nome}</b>  `;
  card.appendChild(cardBody);

  const delBtn = document.createElement("button");
  delBtn.classList.add("btn", "btn-outline-danger", "btn-sm");
  delBtn.textContent = "DEL";
  cardBody.appendChild(delBtn);

  if (transazioni.length > 0) {
    const cardList = document.createElement("ul");
    card.appendChild(cardList);
    cardList.classList.add("list-group", "list-group-flush");

    for (let transazione of transazioni) {
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      if (transazione.valore > 0)
        li.innerHTML = ` <span class="badge bg-success"> ${itFormatNumber.format(
          transazione.valore
        )}</span>  ${transazione.personaCoinvolta}`;
      else
        li.innerHTML = ` <span class="badge bg-danger"> ${itFormatNumber.format(
          transazione.valore
        )} </span> ${transazione.personaCoinvolta}`;
      cardList.appendChild(li);
    }
  }

  delBtn.addEventListener("click", (e) => {
    try {
      vacanza.removePersona(persona);
      vacanzaService.salva(vacanza);
      renderListaPersone(vacanza);
      pagamentiUi.renderDatalistpersone(vacanza);
    } catch (error) {
      Swal.fire("Errore", error.message, "error");
    }
  });

  return card;
}

/**
 *
 * @param vacanza
 */
function renderForm(vacanza: Vacanza): void {
  const form = document.createElement("form");

  const divFormFloating = document.createElement("div");
  divFormFloating.classList.add("form-floating");
  form.appendChild(divFormFloating);

  const inputEl = <HTMLInputElement>document.createElement("input");
  inputEl.type = "text";
  inputEl.placeholder = "Nome persona";
  inputEl.id = "nome_persona";
  inputEl.classList.add("form-control");
  divFormFloating.appendChild(inputEl);

  const floatingLabel = document.createElement("label");
  floatingLabel.htmlFor = inputEl.id;
  floatingLabel.textContent = "Nome persona";
  divFormFloating.appendChild(floatingLabel);

  const submitBtn = document.createElement("input");
  submitBtn.type = "submit";
  submitBtn.value = "Aggiungi";
  submitBtn.classList.add("btn", "btn-secondary");
  form.appendChild(submitBtn);

  form.addEventListener("submit", (e) => {
    console.debug("invato..");
    e.preventDefault();
    try {
      vacanza.addPersona(inputEl.value);
      vacanzaService.salva(vacanza);
      pagamentiUi.renderDatalistpersone(vacanza);
      pagamentiUi.popolaDivisioniPagamento(vacanza);
    } catch (error) {
      Swal.fire("Errore", error.message, "error");
    }
    renderListaPersone(vacanza);
  });

  document.getElementById(nomeListaPersona).append(form);
}
