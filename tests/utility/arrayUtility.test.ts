import * as arrUt from "../../src/utility/arrayUtility";
import { expect } from "chai";

describe("hasPropertyEqualAs", () => {
  const array = [{ p: "1" }, { p: "2" }];

  it("Ritorna true in caso la proprieta ed il valore esistono nell array", () => {
    const risultato = arrUt.hasPropertyEqualAs(array, "p", "1");
    expect(risultato).eql(true);
  });

  it("Ritorna true in caso la proprieta ed il valore esistono nell array ma il valore e' di diverso tipo", () => {
    const risultato = arrUt.hasPropertyEqualAs(array, "p", 1);
    expect(risultato).eql(true);
  });

  it("Ritorna false in caso la proprieta NON esiste nell array", () => {
    const risultato = arrUt.hasPropertyEqualAs(array, "n", "1");
    expect(risultato).eql(false);
  });

  it("Ritorna false in caso la proprieta esiste nell array, ma non il valore", () => {
    const risultato = arrUt.hasPropertyEqualAs(array, "p", "3");
    expect(risultato).eql(false);
  });

  it("Ritorna false se larray e' vuoto", () => {
    const risultato = arrUt.hasPropertyEqualAs([], "p", "2");
    expect(risultato).eql(false);
  });
});
