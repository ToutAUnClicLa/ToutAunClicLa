import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos de Servicio | A un clic la',
  description: 'Términos y condiciones de uso de nuestra plataforma de e-commerce',
};

export default function TerminosPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-indigo-600">Términos de Servicio</h1>
      
      <div className="space-y-8 text-gray-700 dark:text-gray-300">
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">1. Introducción</h2>
          <p className="mb-3">
            Bienvenido a A un clic la. Estos Términos de Servicio rigen su uso de nuestra plataforma de e-commerce, 
            incluyendo cualquier aplicación móvil asociada. Al acceder o utilizar nuestro servicio, usted acepta estar 
            sujeto a estos términos. Si no está de acuerdo con alguna parte de los términos, no podrá acceder al servicio.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">2. Cuentas de Usuario</h2>
          <p className="mb-3">
            Al crear una cuenta en nuestra plataforma, usted es responsable de mantener la seguridad de su cuenta y 
            contraseña. La empresa no será responsable por ninguna pérdida o daño derivado de su incumplimiento de 
            esta obligación de seguridad.
          </p>
          <p className="mb-3">
            Usted es responsable de toda la actividad que ocurra bajo su cuenta y cualquier otra acción realizada en 
            relación con la cuenta. No debe compartir su contraseña ni permitir que otra persona acceda a su cuenta.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">3. Productos y Servicios</h2>
          <p className="mb-3">
            Nos esforzamos por mostrar con la mayor precisión posible los colores y características de nuestros productos. 
            No podemos garantizar que la visualización de cualquier color en su monitor sea exacta.
          </p>
          <p className="mb-3">
            Nos reservamos el derecho, pero no estamos obligados, a limitar las ventas de nuestros productos o servicios 
            a cualquier persona, región geográfica o jurisdicción. Podemos ejercer este derecho caso por caso.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">4. Precios y Pagos</h2>
          <p className="mb-3">
            Todos los precios pueden cambiar sin previo aviso. Nos reservamos el derecho de modificar o discontinuar 
            el servicio sin previo aviso en cualquier momento.
          </p>
          <p className="mb-3">
            No seremos responsables ante usted o cualquier tercero por cualquier modificación, cambio de precio, 
            suspensión o discontinuidad del servicio.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">5. Envíos y Entregas</h2>
          <p className="mb-3">
            Los tiempos de entrega son estimados y pueden variar según la ubicación y otros factores. No nos 
            responsabilizamos por retrasos causados por servicios de mensajería o eventos fuera de nuestro control.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">6. Devoluciones y Reembolsos</h2>
          <p className="mb-3">
            Nuestra política de devoluciones permite devolver productos en un plazo de 14 días desde la recepción, 
            siempre que estén en su estado original. Los reembolsos se procesarán utilizando el mismo método de pago 
            utilizado para la compra.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">7. Propiedad Intelectual</h2>
          <p className="mb-3">
            El servicio y todo su contenido original, características y funcionalidad son propiedad de A un clic la 
            y están protegidos por leyes internacionales de derechos de autor, marcas registradas, patentes, secretos 
            comerciales y otros derechos de propiedad intelectual o de propiedad.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">8. Limitación de Responsabilidad</h2>
          <p className="mb-3">
            En ningún caso A un clic la, sus directores, empleados o agentes serán responsables por cualquier daño 
            indirecto, incidental, especial, consecuente o punitivo, incluyendo sin limitación, pérdida de beneficios, 
            datos, uso, buena voluntad, u otras pérdidas intangibles.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">9. Ley Aplicable</h2>
          <p className="mb-3">
            Estos términos se regirán e interpretarán de acuerdo con las leyes de España, sin tener en cuenta sus 
            disposiciones sobre conflictos de leyes.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">10. Cambios a los Términos</h2>
          <p className="mb-3">
            Nos reservamos el derecho, a nuestra sola discreción, de actualizar, cambiar o reemplazar cualquier parte 
            de estos Términos de Servicio publicando actualizaciones y cambios en nuestro sitio web. Es su responsabilidad 
            revisar nuestro sitio web periódicamente para ver los cambios.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">11. Contacto</h2>
          <p className="mb-3">
            Si tiene alguna pregunta sobre estos Términos de Servicio, por favor contáctenos a través de 
            <a href="mailto:info@aunclic.com" className="text-indigo-600 hover:underline ml-1">info@aunclic.com</a>.
          </p>
        </section>
      </div>
      
      <div className="mt-12 text-sm text-gray-500 dark:text-gray-400 text-center">
        <p>Última actualización: {new Date().toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
      </div>
    </div>
  );
} 