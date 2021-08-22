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

describe("sumArrayProp", () => {
  it("Ritorna somma dato array che contiene oggetti che anno tutti la proprieta desiderata", () => {
    const array = [{ p: 1 }, { p: 1 }, { p: 2 }];
    const risultato = arrUt.sumArrayProp(array, "p");
    expect(risultato).eql(4);
  });

  it("Ritorna 0 dato array vuoto", () => {
    const risultato = arrUt.sumArrayProp([], "p");
    expect(risultato).eql(0);
  });

  it('Ritorna 0 data la proprieta ""', () => {
    const risultato = arrUt.sumArrayProp([{ p: 1 }], "");
    expect(risultato).eql(0);
  });

  it("Ritorna 0 dato array che contiene oggetti senza la proprieta' in input", () => {
    const array = [{ p: 1 }, { p: 1 }, { p: 2 }];
    const risultato = arrUt.sumArrayProp(array, "n");
    expect(risultato).eql(0);
  });

  it("Ritorna somma dato array che contiene oggetti i quali alcuni hanno la proprieta desiderata ed altri no", () => {
    const array = [{ p: 1 }, { n: 1 }, { p: 2 }, {}];
    let risultato = arrUt.sumArrayProp(array, "p");
    expect(risultato).eql(3);

    risultato = arrUt.sumArrayProp(array, "n");
    expect(risultato).eql(1);
  });
});
