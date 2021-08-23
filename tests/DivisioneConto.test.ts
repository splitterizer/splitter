import { expect } from "chai";
import DivisioneConto from "../src/DivisioneConto";
import DivisoriConto from "../src/interfaccie/DivisoriConto";
import Vacanza from "../src/Vacanza";

describe("divisioneConto", () => {
  it("Deve ritornare un array vuoto di transazioni quando non esistono persone nella vacanza", () => {
    const v = new Vacanza("Nome Vacanza");
    const divisioneConto = new DivisioneConto(v);
    expect(divisioneConto.getTransazioni("Persona")).to.be.an.instanceOf(Array)
      .to.be.empty;
  });
});
