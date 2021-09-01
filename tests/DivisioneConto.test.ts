import { expect } from "chai";
import DivisioneConto from "../src/DivisioneConto";
import Vacanza from "../src/Vacanza";
import Persona from "./../src/interfaccie/Persona";

describe("divisioneConto", () => {
  it("Deve ritornare un array vuoto di transazioni quando non esistono persone nella vacanza", () => {
    const v = new Vacanza("Nome Vacanza");
    const divisioneConto = new DivisioneConto(v);
    expect(divisioneConto.getTransazioni("Persona")).to.be.an.instanceOf(Array)
      .to.be.empty;
  });

  it("Deve ritornare 0 euro come spesa a persona se non esistono persone", () => {
    const v = new Vacanza("Nome Vacanza");
    const divisioneConto = new DivisioneConto(v);
    expect(divisioneConto.spesaAPersona).to.be.eql(0);
  });
  it("Deve ritornare un array vuoto di transazioni quando non esistono spese nella vacanza", () => {
    const v = new Vacanza("Nome Vacanza");
    const persona: Persona = { nome: "Perosna1" };
    v.addPersona(persona);
    v.addPersona("Persona2");
    const divisioneConto = new DivisioneConto(v);
    expect(divisioneConto.getTransazioni(persona.nome)).to.be.an.instanceOf(
      Array
    ).to.be.empty;
  });

  it("Deve ritornare 0 euro come spesa a persona se non esistono transazioni", () => {
    const v = new Vacanza("Nome Vacanza");
    const persona: Persona = { nome: "Perosna1" };
    v.addPersona(persona);
    v.addPersona("Persona2");
    const divisioneConto = new DivisioneConto(v);
    expect(divisioneConto.spesaAPersona).to.be.eql(0);
  });
});

describe("Test Debiti/Crediti Persone", () => {
  it("Deve dare un debito di 1/3 verso la persona che ha pagato", () => {
    const v = new Vacanza("a");
    const sanguisuga: Persona = { nome: "Sanguisuga" };
    const pagante: Persona = { nome: "Pagante" };
    v.addPersona(pagante);
    v.addPersona("larva1");
    v.addPersona(sanguisuga);

    v.addPagamento("Primo", 100, pagante);

    const divisione = new DivisioneConto(v);

    const contoSanguisuga = divisione.divisioniConto.conti.find(
      (c) => c.persona.nome === sanguisuga.nome
    );

    expect(contoSanguisuga).to.be.not.undefined;

    if (!contoSanguisuga)
      throw new Error(
        `La funzione non ha ritornato correttamente il conto di ${sanguisuga.nome}`
      );

    expect(contoSanguisuga.transazioni.length).to.be.eql(1);
    const unicaTransazioneTodoSanguisuga = contoSanguisuga.transazioni[0];
    expect(unicaTransazioneTodoSanguisuga.personaCoinvolta).to.be.eql(
      pagante.nome
    );
    expect(unicaTransazioneTodoSanguisuga.valore).to.be.equal(-33.33);
  });

  it("Deve restituire un credito di 1/3 da ogni pesona per un toale di 2/3", () => {
    const v = new Vacanza("a");
    const sanguisuga: Persona = { nome: "Sanguisuga" };
    const pagante: Persona = { nome: "Pagante" };
    v.addPersona(pagante);
    v.addPersona("larva1");
    v.addPersona(sanguisuga);

    v.addPagamento("Primo", 100, pagante);

    const divisione = new DivisioneConto(v);

    const contoPagante = divisione.divisioniConto.conti.find(
      (c) => c.persona.nome === pagante.nome
    );

    expect(contoPagante).to.be.not.undefined;

    if (!contoPagante)
      throw new Error(
        `La funzione non ha ritornato correttamente il conto di ${pagante.nome}`
      );

    expect(contoPagante.transazioni.length).to.be.eql(2);
    for (let transazione of contoPagante.transazioni) {
      expect(transazione.valore).to.be.equal(33.33);
    }
  });
});
