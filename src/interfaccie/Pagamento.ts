import Persona from "./Persona.js";

export default interface Pagamento {
  prezzo: number;
  persona: Persona;
  descrizione: string;
}
