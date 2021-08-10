import Persona from "./Persona";

export default interface Pagamento {
  prezzo: number;
  persona: Persona;
  descrizione: string;
}
