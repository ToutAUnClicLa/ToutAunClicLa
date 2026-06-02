/**
 * Imprime la factura de un pedido sin navegar de página: carga la página de
 * factura en un iframe oculto y dispara el diálogo de impresión del navegador
 * cuando termina de cargar. Tras imprimir, elimina el iframe.
 *
 * @param orderId id del pedido
 * @param context "super" (factura global) | "restaurant" (factura parcial)
 */
export function printInvoice(orderId: number | string, context: "super" | "restaurant" = "super") {
  if (typeof window === "undefined") return;

  const url = context === "restaurant"
    ? `/factura/${orderId}?context=restaurant&autoPrint=1`
    : `/factura/${orderId}?autoPrint=1`;

  // Crear iframe oculto
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.setAttribute("aria-hidden", "true");
  iframe.src = url;

  // El iframe se autodestruye al cerrar el diálogo de impresión.
  // Se hace dentro de la propia página de factura cuando recibe ?autoPrint=1.
  document.body.appendChild(iframe);

  // Failsafe: si por alguna razón el iframe no se limpia, lo quitamos a los 60s
  setTimeout(() => {
    if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
  }, 60_000);
}
