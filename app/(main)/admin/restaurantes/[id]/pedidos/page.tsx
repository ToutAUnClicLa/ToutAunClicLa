import { RestaurantOrdersManager } from "@/components/admin/restaurant-manager";

export default function SuperAdminPedidosPage({ params }: { params: { id: string } }) {
    const restauranteId = parseInt(params.id);

    return (
        <div className="space-y-6">
            <RestaurantOrdersManager restauranteId={restauranteId} />
        </div>
    );
}
