import Persona from "./Persona.js";
import Transazione from "./Transazione.js";

export default interface Conto {
  persona: Persona;
  transazioni: Array<Transazione>;
  giaPagato: number;
}
