import Persona from "./Persona";
import Transazione from "./Transazione";

export default interface Conto {
  persona: Persona;
  transazioni: Array<Transazione>;
  giaPagato: number;
}
