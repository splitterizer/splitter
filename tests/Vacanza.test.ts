import Vacanza from "../src/Vacanza";
import { expect } from "chai";
import Persona from "./../src/interfaccie/Persona";

describe("Vacanza", () => {
  it("Instanziare la calsse con in nome in input", () => {
    const nomeVacanza = "nomeVacanza";
    const v = new Vacanza(nomeVacanza);
    expect(v.nome).to.equal(nomeVacanza);
  });

  it("Instanziare array vuoti per persone e pagamenti", () => {
    const v = new Vacanza("a");
    const persone = v.persone;
    expect(persone).to.be.an("array").that.is.empty;

    const pagamenti = v.pagamenti;
    expect(pagamenti).to.be.an("array").that.is.empty;
  });

  it("Deve ritornare una copia delle persone che contiene", () => {
    const v = new Vacanza("a");
    v.addPersona("p1");
    v.addPersona("p2");

    let persone = v.persone;
    // riduco le persone nell'array
    persone.splice(0, 1);
    expect(persone.length).not.to.equal(v.persone.length);
  });

  it("Deve salvare una copia della persona che deve includere ", () => {
    const v = new Vacanza("a");
    const persona: Persona = {
      nome: "Persona1",
    };

    v.addPersona(persona);

    persona.nome = "Persona1Rinominata";
    const personaAggiuntaPrima = v.persone[0];

    expect(persona.nome).not.to.equal(personaAggiuntaPrima.nome);

    personaAggiuntaPrima.nome = "Persona1Rinominata - Fase 2";

    expect(personaAggiuntaPrima.nome).not.to.equal(v.persone[0].nome);
  });
});
