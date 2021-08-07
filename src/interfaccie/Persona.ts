export default interface Persona {
  nome: string;
}

/**
 *
 * @param persona persona o sezione
 * @returns una persona
 */
function ottieniPersona(persona: Persona | string): Persona {
  let personaDaAggiungere: Persona;
  if (typeof persona === "string")
    personaDaAggiungere = {
      nome: persona,
    };
  else personaDaAggiungere = persona;
  return personaDaAggiungere;
}

export { ottieniPersona };
