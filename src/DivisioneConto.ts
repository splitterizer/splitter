import Vacanza from "./Vacanza.js";
import * as arrayUtility from "./utility/arrayUtility.js";

import DivisoriConto from "./interfaccie/DivisoriConto.js";
import Conto from "./interfaccie/Conto.js";
import Persona from "./interfaccie/Persona.js";
import Transazione from "./interfaccie/Transazione.js";

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

    // desc
    creditori.sort((a, b) => b.giaPagato - a.giaPagato);
    debitori.sort((a, b) => b.giaPagato - a.giaPagato);

    while (creditori.length > 0) {
      creditori.forEach((creditore, idxCreditore) => {
        debitori.forEach((debitore, idxDebitore) => {
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

          if (this.getCreditoResiduo(creditore) < 0.5)
            creditori.splice(idxCreditore, 1);

          if (this.getDebitoResiduo(debitore) < 0.5)
            debitori.splice(idxDebitore, 1);
        });
      });
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
    const { transazioni } = this.divisioniConto.conti.find(
      (c) => c.persona.nome === persona.nome
    );
    return transazioni;
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
