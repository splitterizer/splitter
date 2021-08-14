import Vacanza from "./Vacanza";
import * as arrayUtility from "./utility/arrayUtility";

import DivisoriConto from "./interfaccie/DivisoriConto";
import Conto from "./interfaccie/Conto";
import Persona from "./interfaccie/Persona";
import Transazione from "./interfaccie/Transazione";

/**
 * Tollerranza di errore nella divisione dei conti
 */
const ERRORE_ACCETTATO = 0.2;

export default class DivisioneConto {
  private divisoriConto: DivisoriConto = {
    spesaAPersona: 0,
    conti: [],
    nomeVacanza: "",
  };

  constructor(vacanza: Vacanza) {
    const numPersone = vacanza.persone.length;
    if (numPersone == 0) return;
    const totSpesa = arrayUtility.sumArrayProp(vacanza.pagamenti, "prezzo");
    this.divisoriConto.spesaAPersona = totSpesa / numPersone;

    this.divisoriConto.nomeVacanza = vacanza.nome;
    for (let persona of vacanza.persone) {
      const conto: Conto = {
        persona,
        transazioni: [],
        giaPagato: 0,
      };
      conto.giaPagato = arrayUtility.sumArrayProp(
        vacanza.pagamenti.filter((p) => p.persona.nome === persona.nome),
        "prezzo"
      );
      this.divisoriConto.conti.push(conto);
    }
    const debitori: Array<Conto> = [],
      creditori: Array<Conto> = [];
    for (let conto of this.divisoriConto.conti) {
      if (conto.giaPagato < this.spesaAPersona) debitori.push(conto);
    }
    for (let conto of this.divisoriConto.conti) {
      if (conto.giaPagato > this.spesaAPersona) creditori.push(conto);
    }

    while (creditori.length > 0) {
      // desc
      creditori.sort((a, b) => b.giaPagato - a.giaPagato);
      debitori.sort((a, b) => b.giaPagato - a.giaPagato);

      const creditore = creditori[0];
      const debitore = debitori[0];

      const scambio = Math.min(
        this.getCreditoResiduo(creditore),
        this.getDebitoResiduo(debitore)
      );
      console.debug(
        `Creditore ${creditore.persona.nome} Debitore ${debitore.persona.nome} per ${scambio}`
      );
      const transazioneCredito: Transazione = {
        personaCoinvolta: debitore.persona.nome,
        valore: scambio,
      };
      creditore.transazioni.push(transazioneCredito);
      const transazioneDebito: Transazione = {
        personaCoinvolta: creditore.persona.nome,
        valore: -scambio,
      };
      debitore.transazioni.push(transazioneDebito);

      if (this.getCreditoResiduo(creditore) < ERRORE_ACCETTATO)
        creditori.splice(0, 1);

      if (this.getDebitoResiduo(debitore) < ERRORE_ACCETTATO)
        debitori.splice(0, 1);
    }
  }

  public get spesaAPersona(): number {
    return this.divisoriConto.spesaAPersona;
  }

  public get divisioniConto(): DivisoriConto {
    return this.divisoriConto;
  }

  /**
   * getTransazioni della persona
   */
  public getTransazioni(persona: Persona): Array<Transazione> {
    if (!this.divisioniConto.conti) return [];
    const conto = this.divisioniConto.conti.find(
      (c) => c.persona.nome === persona.nome
    );
    if (conto) {
      const { transazioni } = conto;
      return transazioni;
    }
    return [];
  }

  private getCreditoResiduo(creditore: Conto): number {
    let credito = creditore.giaPagato - this.spesaAPersona;
    for (let transazione of creditore.transazioni) {
      credito -= transazione.valore;
    }
    return Math.round(credito * 100) / 100;
  }
  private getDebitoResiduo(creditore: Conto): number {
    let debito = this.spesaAPersona - creditore.giaPagato;
    for (let transazione of creditore.transazioni) {
      debito += transazione.valore;
    }
    return Math.round(debito * 100) / 100;
  }
}
