import { expect } from "chai";
import DivisioneConto from "../src/DivisioneConto";
import DivisoriConto from "../src/interfaccie/DivisoriConto";
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
});
