import Vacanza, { VacanzaProperties } from "../Vacanza.js";

const nomeStorage: string = "vacanze";

/**
 *
 * @returns array di vacanze
 */
export function getAll(): Array<Vacanza> {
  const vacanzeString = localStorage.getItem(nomeStorage);
  if (!vacanzeString) return [];

  const vacanzeAttr: Array<VacanzaProperties> = JSON.parse(vacanzeString);
  let vacanze: Array<Vacanza> = [];

  vacanzeAttr.forEach((element) => {
    const vacanza = Vacanza.byJson(element);
    vacanze.push(vacanza);
  });
  return vacanze;
}

/**
 * salva ed eventualmente sostitusce la vacanza
 * @param vacanza vacanza da salvare
 */
export function salva(vacanza: Vacanza): void {
  const vacanze = getAll();
  const idx = vacanze.findIndex((i) => i.nome === vacanza.nome);
  if (idx !== -1) vacanze[idx] = vacanza;
  else vacanze.push(vacanza);

  saveAll(vacanze);
}

/**
 * rimuove dal salvataggio una singola vacanza
 * @param vacanza vacanza da rimuovere
 * @returns Lista aggiornata delle vacanze
 */
export function remove(
  vacanza: Vacanza | VacanzaProperties | string
): Array<Vacanza> {
  const vacanze = getAll();
  let nomeVacanza: string;
  if (vacanza instanceof Vacanza) nomeVacanza = vacanza.nome;
  else if (typeof vacanza === "string") nomeVacanza = vacanza;
  else nomeVacanza = vacanza._nome;

  const idx = vacanze.findIndex((i) => i.nome === nomeVacanza);
  if (idx === -1) throw new Error(`Vacanza ${nomeVacanza} non esiste`);
  vacanze.splice(idx, 1);
  saveAll(vacanze);
  return vacanze;
}

/**
 * salva tutto l'array delle vacanze
 * @param vacanze array di vacanze da salvare
 */
function saveAll(vacanze: Array<Vacanza>) {
  const vacanzeToExport: Array<VacanzaProperties> = [];
  for (let vacanzaDett of vacanze) vacanzeToExport.push(vacanzaDett.toObject());

  localStorage.setItem(nomeStorage, JSON.stringify(vacanzeToExport));
}
