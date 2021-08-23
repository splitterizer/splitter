import DivisioneConto from "./DivisioneConto";
import Pagamento from "./interfaccie/Pagamento";
import Persona, { ottieniPersona } from "./interfaccie/Persona";

export interface VacanzaProperties {
  _nome: string;
  _persone: Array<Persona>;
  _pagamenti: Array<Pagamento>;
}

export default class Vacanza {
  private attr: VacanzaProperties;

  constructor(nome: string) {
    if (nome === "") throw new Error("Il nome non puo' essere vuoto");
    this.attr = {
      _nome: nome,
      _pagamenti: [],
      _persone: [],
    };
  }
  public get pagamenti(): Array<Pagamento> {
    return this.attr._pagamenti.map((pagamento) => {
      return { ...pagamento };
    });
  }

  public get nome(): string {
    return this.attr._nome;
  }

  public get persone(): Array<Persona> {
    return this.attr._persone.map((persona) => {
      return { ...persona };
    });
  }

  /**
   * Aggiunge una persona alla vacanza
   * @param persona persona o nome della persona da aggiungere alla vacanza
   */
  public addPersona = (persona: Persona | string): void => {
    const personaDaAggiungere = ottieniPersona(persona);
    const idx = this.attr._persone.findIndex(
      (p) => p.nome === personaDaAggiungere.nome
    );
    if (idx !== -1)
      throw new Error(
        `${personaDaAggiungere.nome} gia' presente nella vacanza`
      );

    this.attr._persone.push({ ...personaDaAggiungere });
  };

  /**
   *
   * @param persona da rimuovere
   * @returns la persona rimossa
   */
  public removePersona = (persona: Persona | string): Persona => {
    const personaDaAggiungere = ottieniPersona(persona);
    const idx = this.attr._persone.findIndex(
      (p) => p.nome === personaDaAggiungere.nome
    );
    if (idx === -1)
      throw new Error(`${personaDaAggiungere.nome} non presente nella vacanza`);

    // controllo che non abbia pagato qualcosa
    for (let pagamento of this.attr._pagamenti)
      if (pagamento.persona.nome === personaDaAggiungere.nome)
        throw new Error(
          `Impossibile rimuovere ${personaDaAggiungere.nome}, ha effettuato dei pagamenti`
        );

    // ora rimuovo la persona
    this.attr._persone.splice(idx, 1);

    return personaDaAggiungere;
  };

  /**
   *
   * @param pagamento da rimuovere
   * @returns pagamento rimosso
   */
  public removePagamento = (pagamento: Pagamento | string): Pagamento => {
    const descrPagamento =
      typeof pagamento === "string" ? pagamento : pagamento.descrizione;
    const idx = this.attr._pagamenti.findIndex(
      (p) => p.descrizione === descrPagamento
    );
    if (idx === -1)
      throw new Error(
        `Pagamento "${descrPagamento}" non presente nella vacanza`
      );

    // controllo
    const pagamentoRimosso = this.attr._pagamenti[idx];

    // ora rimuovo la persona
    this.attr._pagamenti.splice(idx, 1);

    return pagamentoRimosso;
  };

  /**
   *
   * @param descrizione
   * @param prezzo
   * @param persona
   * @returns pagamento inserito
   */
  public addPagamento = (
    descrizione: string,
    prezzo: number,
    persona: Persona | string
  ): Pagamento => {
    if (descrizione === "") throw new Error("Definire una descrizione");

    if (prezzo <= 0) throw new Error("Prezzo deve essere maggiore di 0");

    const personaDaAggiungere = ottieniPersona(persona);

    const idxPersona = this.attr._persone.findIndex(
      (p) => p.nome === personaDaAggiungere.nome
    );
    if (idxPersona === -1) {
      // persona non nella vacanza
      this.addPersona(personaDaAggiungere);
    }

    const pagamento = {
      descrizione,
      prezzo,
      persona: personaDaAggiungere,
    };

    const idx = this.attr._pagamenti.findIndex(
      (p) => p.descrizione === pagamento.descrizione
    );
    if (idx !== -1)
      throw new Error(
        `Pagamento con descrizione "${pagamento.descrizione}" gia' presente`
      );

    this.attr._pagamenti.push(pagamento);

    return pagamento;
  };

  public toObject(): VacanzaProperties {
    return {
      _nome: this.nome,
      _pagamenti: this.pagamenti,
      _persone: this.persone,
    };
  }

  public static byJson(jsonData: VacanzaProperties | string): Vacanza {
    let json: VacanzaProperties;
    if (typeof jsonData === "string") json = JSON.parse(jsonData);
    else json = jsonData;

    const vacanza = new Vacanza(json._nome);
    for (let persona of json._persone) {
      vacanza.addPersona(persona);
    }
    for (let pagamento of json._pagamenti) {
      vacanza.addPagamento(
        pagamento.descrizione,
        pagamento.prezzo,
        pagamento.persona
      );
    }
    return vacanza;
  }

  /**
   * getDivisioneSpese
   */
  public getDivisioneSpese(): DivisioneConto {
    return new DivisioneConto(this);
  }
}
