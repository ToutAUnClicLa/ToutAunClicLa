"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { restaurantAdminService } from "@/lib/services/restaurant";
import { API_CONFIG } from "@/lib/config/api";
import { Loader2, Plus, Edit2, Trash2, PackageSearch, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { superAdminService } from "@/lib/services/superAdmin";

interface RestaurantProductsManagerProps {
    restauranteId?: number;
}

export default function RestaurantProductsManager({ restauranteId }: RestaurantProductsManagerProps) {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 8;

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [restauranteId, currentPage, searchTerm]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            let responseData;
            if (restauranteId) {
                // Modo Admin Local: Pasar params a la URL
                const queryParams = new URLSearchParams({
                    page: currentPage.toString(),
                    limit: itemsPerPage.toString(),
                    ...(searchTerm ? { search: searchTerm } : {})
                });
                
                const res = await fetch(`${API_CONFIG.BASE_URL}/restaurants/products?restauranteId=${restauranteId}&${queryParams.toString()}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                });
                responseData = await res.json();
            } else {
                responseData = await restaurantAdminService.getProducts(currentPage, itemsPerPage, searchTerm);
            }
            
            setProducts(responseData.products || []);
            setTotalPages(responseData.totalPages || 1);
            setTotalItems(responseData.total || 0);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar productos");
        } finally {
            setLoading(false);
        }
    };

    const handleNewProduct = () => {
        if (restauranteId) {
            router.push(`/admin/restaurantes/${restauranteId}/productos/nuevo`);
        } else {
            router.push(`/restaurante/productos/nuevo`);
        }
    };

    const handleEditProduct = (product: any) => {
        // En un caso real pasaríamos product props via context, zustand o params, o simplemente re-fetchear en la página id.
        // Como estamos haciendo la UI, redirigimos al ID.
        if (restauranteId) {
            router.push(`/admin/restaurantes/${restauranteId}/productos/editar/${product.id}`);
        } else {
            router.push(`/restaurante/productos/editar/${product.id}`);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este producto?")) return;
        try {
            if (restauranteId) {
                await fetch(`${API_CONFIG.BASE_URL}/restaurants/products/${id}?restauranteId=${restauranteId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                });
            } else {
                await restaurantAdminService.deleteProduct(id);
            }
            toast.success("Producto eliminado");
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error("Error al eliminar");
        }
    };



    const DAYS_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    if (loading && products.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-heading text-slate-900 tracking-tight">Catálogo de Productos {restauranteId && "(Modo Admin Local)"}</h2>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">Administra los productos y platos ofrecidos en el menú</p>
                </div>
                <Button onClick={handleNewProduct} className="w-full sm:w-auto justify-center flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm rounded-xl px-5 h-10">
                    <Plus className="w-4 h-4" /> Nuevo Producto
                </Button>
            </div>

            <div className="bg-white shadow-sm flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl gap-4 border border-slate-200/60">
                <div className="relative w-full sm:max-w-md transition-all duration-200 focus-within:ring-2 focus-within:ring-indigo-100 rounded-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Buscar producto por nombre o descripción..."
                        className="pl-9 bg-slate-50/50 border-slate-200 focus-visible:bg-white focus-visible:border-indigo-300"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset page on search
                        }}
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] sm:text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold tracking-wider">Producto</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold tracking-wider">Precio</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold tracking-wider">Días Aprobados</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 relative text-xs sm:text-sm">
                            {loading && products.length > 0 && (
                                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 w-full h-full">
                                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                                </div>
                            )}
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            {product.imagen_principal ? (
                                                <img src={product.imagen_principal} alt={product.nombre} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover shadow-sm border border-slate-100 shrink-0" />
                                            ) : (
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 shrink-0">
                                                    <PackageSearch className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <div className="font-bold text-slate-900 truncate">{product.nombre}</div>
                                                <div className="text-slate-500 text-[10px] sm:text-xs mt-0.5 truncate max-w-[120px] sm:max-w-[200px]">{product.descripcion}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-emerald-600 whitespace-nowrap">
                                        ${Number(product.precio).toFixed(2)}
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-slate-500">
                                        <div className="flex flex-wrap gap-1">
                                            {DAYS_NAMES.map((name, i) => (
                                                <span key={i} className={`px-1.5 py-0.5 rounded border ${product.dias_disponibles.includes(i) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
                                                    {name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)} className="h-8 w-8 p-0 shrink-0 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)} className="h-8 w-8 p-0 shrink-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500 bg-slate-50/30">
                                        <PackageSearch className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                                        La lista de productos del catálogo se encuentra vacía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <span className="text-sm text-slate-500 font-medium">
                            Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} productos
                        </span>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Anterior
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Siguiente
                            </Button>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
