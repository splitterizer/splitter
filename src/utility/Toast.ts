import Swal from "../../node_modules/sweetalert2/src/sweetalert2.js";

enum levelMessage {
  info = "info",
  error = "error",
  success = "success",
  warning = "warning",
}

export default class StdOut {
  public static levelsMessage = levelMessage;

  /**
   * Mostra un semplice messaggio come toast
   * @param message messggio
   * @param livello di severita' del messaggio
   * @param title titolo del messaggio
   * @param onCloseCallback funzione richiamata alla chiusura del messaggio
   */
  public static showSimpleMessage(
    message: string,
    level: levelMessage,
    title?: string,
    onCloseCallback?: Function
  ): void {
    Swal.fire({
      title,
      text: message,
      timer: 2000,
      icon: level,
    })
      .then(() => {
        if (onCloseCallback) onCloseCallback();
      })
      .catch((e) => {
        console.error("Errore chiusura alert");
        console.error(e);
      });

    console[level](message);
  }
}
