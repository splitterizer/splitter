import Conto from "./Conto";

export default interface DivisoriConto {
  nomeVacanza: string;
  conti: Array<Conto>;
  spesaAPersona: number;
}
