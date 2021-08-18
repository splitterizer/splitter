import Swal from "sweetalert2";

import Vacanza from "../Vacanza";
import * as ArrayUtility from "../utility/arrayUtility";
import * as vacanzaService from "../service/vacanzeService";

import * as PersoneUi from "./personeUI";
import * as PagamentiUi from "./pagamentiUI";

let vacanze: Array<Vacanza> = vacanzaService.getAll();
export function init() {
  renderListaVacanze();

  const formVacanza = document.getElementById("formVacanza")!;

  formVacanza.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const inputEl = <HTMLInputElement>document.getElementById("nomeVacanza");
    try {
      if (ArrayUtility.hasPropertyEqualAs(vacanze, "nome", inputEl.value))
        throw new Error(`Vacanza ${inputEl.value} gia presente`);

      const vacanza = new Vacanza(inputEl.value);

      vacanze.push(vacanza);
      vacanzaService.salva(vacanza);

      Swal.fire(`Vacanza ${inputEl.value} aggiunta`, "", "success");

      renderListaVacanze();
    } catch (error) {
      console.error(error);
      Swal.fire("errore", error.message, "error").then(() => {
        inputEl.focus();
      });
    } finally {
      inputEl.value = "";
    }
  });
  console.debug("listener attivato...");
}

export function renderListaVacanze(inVacanze?: Array<Vacanza>) {
  if (inVacanze) vacanze = [...inVacanze];
  const ol = document.getElementById("lista-vacanze")!;
  ol.innerHTML = "";

  document
    .querySelectorAll(".vacanza-detail")
    .forEach((e) => (e.innerHTML = ""));

  vacanze.forEach((vacanza) => {
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "align-items-start",
      "justify-content-between"
    );
    li.id = vacanza.nome;
    li.textContent = `${vacanza.nome}`;

    const badge = document.createElement("span");
    badge.classList.add("badge", "bg-danger", "user-select-none");
    badge.style.cursor = "pointer";
    badge.textContent = "DEL";
    li.appendChild(badge);
    ol.appendChild(li);

    li.addEventListener("click", (e) => {
      if (e.target !== e.currentTarget) return;
      ol.querySelectorAll(".active").forEach((listElement) => {
        listElement.classList.remove("active");
        listElement.removeAttribute("aria-current");
      });
      li.classList.add("active");
      li.setAttribute("aria-current", "true");
      PersoneUi.renderListaPersone(vacanza);
      PagamentiUi.renderListaPagamenti(vacanza);
    });

    badge.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const risposta = await Swal.fire({
          title: `Eliminare la vacanza ${vacanza.nome} ?`,
          confirmButtonText: "SI",
          denyButtonText: "no",
          icon: "question",
          showDenyButton: true,
        });
        if (risposta.isConfirmed) {
          renderListaVacanze(vacanzaService.remove(vacanza));
          Swal.fire("Vacanza rimossa", "", "success");
        }
      } catch (error) {
        Swal.fire("errore", error.message, "error");
      }
    });
  });
}
