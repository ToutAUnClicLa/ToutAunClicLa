"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { superAdminService } from "@/lib/services/superAdmin";
import { restaurantAdminService } from "@/lib/services/restaurant";
import { Loader2, Printer } from "lucide-react";
import { Button } from "@/components/common/ui/button";

interface InvoiceItem {
    nombre: string;
    restaurante?: string | null;
    cantidad: number;
    precioUnitario: number;
    tpsRate: number;
    tvqRate: number;
    tps: number;
    tvq: number;
    subtotal: number;
}

interface InvoiceData {
    company: any;
    invoice: {
        orderId: number;
        isPartial: boolean;
        status: string;
        date: string;
        paymentRef: string | null;
        paymentMethod: string;
        deliveryMethod: string | null;
        couponCode: string | null;
        freeShipping: boolean;
    };
    customer: { name: string; email: string | null; phone: string | null };
    shippingAddress: { line1: string; city: string; province: string; postalCode: string } | null;
    items: InvoiceItem[];
    totals: { subtotal: number; tps: number; tvq: number; shipping: number; discount: number; total: number };
}

const fmt = (n: number) => `$${(Number(n) || 0).toFixed(2)}`;

const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("fr-CA", {
        timeZone: "America/Montreal",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

export default function InvoicePage() {
    const { id } = useParams() as { id: string };
    const searchParams = useSearchParams();
    // ?context=restaurant -> usa el endpoint del restaurante (factura parcial,
    // solo con sus items). Por defecto usa el de super admin (factura completa).
    const context = searchParams.get("context") === "restaurant" ? "restaurant" : "super";
    const autoPrint = searchParams.get("autoPrint") === "1";

    const [data, setData] = useState<InvoiceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const fetched = context === "restaurant"
                    ? await restaurantAdminService.getOrderInvoice(id)
                    : await superAdminService.getOrderInvoice(id);
                setData(fetched);
            } catch (e: any) {
                setError(e?.message || "Error cargando la factura");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, context]);

    // Modo "imprimir desde iframe": al terminar de cargar la data, dispara el
    // diálogo de impresión y, cuando el usuario lo cierra, elimina el iframe
    // del documento padre.
    useEffect(() => {
        if (!autoPrint || loading || !data) return;
        const cleanupIframeFromParent = () => {
            try {
                if (window.frameElement && window.frameElement.parentNode) {
                    window.frameElement.parentNode.removeChild(window.frameElement);
                }
            } catch {
                /* mismo origen: no debería fallar */
            }
        };
        const onAfterPrint = () => {
            window.removeEventListener("afterprint", onAfterPrint);
            cleanupIframeFromParent();
        };
        window.addEventListener("afterprint", onAfterPrint);
        const t = setTimeout(() => window.print(), 300);
        return () => {
            clearTimeout(t);
            window.removeEventListener("afterprint", onAfterPrint);
        };
    }, [autoPrint, loading, data]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
                <p className="text-red-600 font-medium">{error || "No se pudo cargar la factura"}</p>
            </div>
        );
    }

    const { company, invoice, customer, shippingAddress, items, totals } = data;

    // En modo autoPrint (cargada en iframe oculto) NO renderizamos la barra ni
    // el chrome de página: solo el documento, para imprimir únicamente la
    // factura sin la ventana del navegador detrás.
    return (
        <div className={autoPrint ? "bg-white" : "min-h-screen bg-slate-50 print:bg-white"}>
            {!autoPrint && (
                <div className="bg-white border-b border-slate-200 print:hidden">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                        <div className="text-sm text-slate-600">
                            Factura del pedido <span className="font-semibold text-slate-900">#{invoice.orderId}</span>
                            {invoice.isPartial && <span className="ml-2 text-xs text-orange-600">(parcial — solo tu restaurante)</span>}
                        </div>
                        <Button onClick={() => window.print()} className="gap-2">
                            <Printer className="w-4 h-4" />
                            Exportar / Imprimir
                        </Button>
                    </div>
                </div>
            )}

            {/* Documento */}
            <div className={
                autoPrint
                    ? "bg-white p-8"
                    : "max-w-3xl mx-auto bg-white shadow-sm my-6 sm:my-8 p-6 sm:p-10 print:shadow-none print:my-0 print:p-8"
            }>
                {/* Encabezado */}
                <div className="flex items-start justify-between border-b border-slate-200 pb-6 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{company.legalName}</h1>
                        {company.tradeName && company.tradeName !== company.legalName && (
                            <p className="text-sm text-slate-500">{company.tradeName}</p>
                        )}
                        <div className="mt-3 text-xs text-slate-600 space-y-0.5">
                            <p>{company.address?.line1}</p>
                            <p>{[company.address?.city, company.address?.province, company.address?.postalCode].filter(Boolean).join(", ")}</p>
                            <p>{company.address?.country}</p>
                            {company.phone && <p>Tél : {company.phone}</p>}
                            {company.email && <p>{company.email}</p>}
                        </div>
                        <div className="mt-3 text-xs text-slate-700 space-y-0.5">
                            <p><span className="font-semibold">N° TPS/GST :</span> {company.taxNumbers?.gst}</p>
                            <p><span className="font-semibold">N° TVQ/QST :</span> {company.taxNumbers?.qst}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide">Facture</h2>
                        <p className="text-sm text-slate-600 mt-1"><span className="font-semibold">N°</span> {invoice.orderId}</p>
                        <p className="text-xs text-slate-500 mt-1">{formatDate(invoice.date)}</p>
                        <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700 capitalize">
                            {invoice.status}
                        </span>
                    </div>
                </div>

                {/* Cliente y envío */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-sm">
                    <div>
                        <h3 className="text-xs font-semibold uppercase text-slate-500 mb-2">Facturado a</h3>
                        <p className="font-medium text-slate-900">{customer.name}</p>
                        {/* En facturas parciales (restaurante) solo se muestra el nombre del cliente.
                            Email y teléfono solo en la factura global del super admin. */}
                        {!invoice.isPartial && customer.email && <p className="text-slate-600">{customer.email}</p>}
                        {!invoice.isPartial && customer.phone && <p className="text-slate-600">{customer.phone}</p>}
                    </div>
                    {shippingAddress && (
                        <div>
                            <h3 className="text-xs font-semibold uppercase text-slate-500 mb-2">Adresse de livraison</h3>
                            <p className="text-slate-700">{shippingAddress.line1}</p>
                            <p className="text-slate-700">
                                {[shippingAddress.city, shippingAddress.province, shippingAddress.postalCode].filter(Boolean).join(", ")}
                            </p>
                        </div>
                    )}
                </div>

                {/* Items */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-y border-slate-200 text-xs uppercase text-slate-500">
                                <th className="text-left py-2 font-semibold">Produit</th>
                                <th className="text-right py-2 font-semibold">Qté</th>
                                <th className="text-right py-2 font-semibold">P.U.</th>
                                <th className="text-right py-2 font-semibold">TPS</th>
                                <th className="text-right py-2 font-semibold">TVQ</th>
                                <th className="text-right py-2 font-semibold">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={idx} className="border-b border-slate-100">
                                    <td className="py-2 pr-2">
                                        <p className="text-slate-900">{item.nombre}</p>
                                        {item.restaurante && <p className="text-xs text-slate-500">{item.restaurante}</p>}
                                    </td>
                                    <td className="py-2 text-right text-slate-700">{item.cantidad}</td>
                                    <td className="py-2 text-right text-slate-700">{fmt(item.precioUnitario)}</td>
                                    <td className="py-2 text-right text-slate-700">
                                        {item.tpsRate > 0 ? `${fmt(item.tps)}` : <span className="text-slate-400">—</span>}
                                    </td>
                                    <td className="py-2 text-right text-slate-700">
                                        {item.tvqRate > 0 ? `${fmt(item.tvq)}` : <span className="text-slate-400">—</span>}
                                    </td>
                                    <td className="py-2 text-right font-medium text-slate-900">{fmt(item.subtotal)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totales */}
                <div className="mt-6 flex justify-end">
                    <div className="w-full sm:w-72 text-sm space-y-1.5">
                        <div className="flex justify-between text-slate-600">
                            <span>Sous-total</span>
                            <span>{fmt(totals.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>TPS (5%)</span>
                            <span>{fmt(totals.tps)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>TVQ (9,975%)</span>
                            <span>{fmt(totals.tvq)}</span>
                        </div>
                        {!invoice.isPartial && totals.shipping > 0 && (
                            <div className="flex justify-between text-slate-600">
                                <span>Livraison</span>
                                <span>{fmt(totals.shipping)}</span>
                            </div>
                        )}
                        {!invoice.isPartial && totals.discount > 0 && (
                            <div className="flex justify-between text-emerald-700">
                                <span>Remise{invoice.couponCode ? ` (${invoice.couponCode})` : ""}</span>
                                <span>−{fmt(totals.discount)}</span>
                            </div>
                        )}
                        <div className="border-t border-slate-300 pt-2 mt-2 flex justify-between text-base font-bold text-slate-900">
                            <span>Total CAD</span>
                            <span>{fmt(totals.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Pie minimalista: solo sitio web */}
                <div className="mt-10 pt-4 border-t border-slate-200 text-xs text-slate-500 text-center">
                    {company.website}
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    @page { margin: 12mm; }
                    body { background: white !important; }
                }
            `}</style>
        </div>
    );
}
