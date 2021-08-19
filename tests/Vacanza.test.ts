import Vacanza from "../src/Vacanza";
import { expect } from "chai";

describe("Vacanza", () => {
  it("Instanziare la calsse con in nome in input", () => {
    const nomeVacanza = "nomeVacanza";
    const v = new Vacanza(nomeVacanza);
    expect(v.nome).to.equal(nomeVacanza + "c");
  });
});
