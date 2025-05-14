import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos de Servicio | Tout à un clic là',
  description: 'Términos y condiciones de uso de nuestra plataforma de comercio electrónico conforme a la legislación canadiense',
};

export default function TerminosPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-indigo-600">Términos de Servicio</h1>
      
      <div className="space-y-8 text-gray-700 dark:text-gray-300">
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">1. Introducción</h2>
          <p className="mb-3">
            Bienvenido a Tout à un clic là. El presente documento constituye un acuerdo legalmente vinculante (&ldquo;Acuerdo&rdquo;) 
            entre usted y Tout à un clic là, regido por las leyes de Canadá. Estos Términos de Servicio regulan su acceso 
            y uso de nuestra plataforma de comercio electrónico (&ldquo;la Plataforma&rdquo;), incluyendo cualquier aplicación móvil asociada, 
            contenido, funcionalidades y servicios ofrecidos.
          </p>
          <p className="mb-3">
            Al acceder o utilizar nuestra Plataforma, usted confirma que ha leído, entendido y acepta estar sujeto a estos 
            términos. Si no está de acuerdo con alguna parte de este Acuerdo, le rogamos que se abstenga de utilizar 
            nuestros servicios.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">2. Elegibilidad y Cuentas de Usuario</h2>
          <p className="mb-3">
            Para utilizar nuestros servicios, usted debe tener al menos 18 años de edad o la mayoría de edad legal en su 
            jurisdicción, lo que sea mayor. Al crear una cuenta, usted garantiza que toda la información proporcionada 
            es veraz, precisa, completa y actualizada.
          </p>
          <p className="mb-3">
            Es su responsabilidad mantener la confidencialidad de su cuenta y contraseña, así como restringir el acceso a 
            su dispositivo. Usted acepta la plena responsabilidad por todas las actividades que ocurran bajo su cuenta. 
            Si sospecha de un uso no autorizado de su cuenta, debe notificárnoslo inmediatamente.
          </p>
          <p className="mb-3">
            Tout à un clic là se reserva el derecho de suspender o terminar su cuenta, a nuestra discreción y sin previo 
            aviso, si determinamos que ha violado cualquier disposición de estos Términos de Servicio o si su conducta 
            podría causar daño a nuestra Plataforma, otros usuarios o terceros.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">3. Productos y Servicios</h2>
          <p className="mb-3">
            Los productos y servicios ofrecidos en nuestra Plataforma están sujetos a disponibilidad. Nos esforzamos por 
            proporcionar descripciones precisas, incluyendo especificaciones, características, y representaciones visuales 
            de nuestros productos. Sin embargo, no garantizamos que dichas descripciones o representaciones sean exactas, 
            completas, confiables, actualizadas o libres de errores.
          </p>
          <p className="mb-3">
            Los colores mostrados en su dispositivo pueden variar de los productos reales debido a diferentes tecnologías 
            de visualización, configuraciones y limitaciones técnicas.
          </p>
          <p className="mb-3">
            Tout à un clic là se reserva el derecho, a su absoluta discreción, de limitar las cantidades de cualquier 
            producto o servicio, restringir las ventas a cualquier persona o región geográfica, y suspender o discontinuar 
            cualquier producto o servicio sin previo aviso.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">4. Precios, Impuestos y Pagos</h2>
          <p className="mb-3">
            Todos los precios están denominados en dólares canadienses (CAD) a menos que se indique lo contrario, y no 
            incluyen impuestos aplicables, tarifas de envío u otros cargos, que serán informados durante el proceso de 
            compra antes de la confirmación del pedido.
          </p>
          <p className="mb-3">
            De acuerdo con la legislación fiscal canadiense, podemos estar obligados a cobrar y remitir impuestos 
            provinciales y federales, incluyendo el Impuesto sobre Bienes y Servicios (GST), el Impuesto de Venta Armonizado 
            (HST) o el Impuesto de Venta Provincial (PST), según corresponda a su ubicación.
          </p>
          <p className="mb-3">
            Nos reservamos el derecho de modificar los precios en cualquier momento sin previo aviso. Su pedido está 
            sujeto al precio vigente en el momento en que completamos su transacción.
          </p>
          <p className="mb-3">
            Aceptamos diversos métodos de pago según se especifica en nuestra Plataforma. Al proporcionar información de 
            pago, usted garantiza que está autorizado a utilizar el método de pago seleccionado y que dicha información 
            es precisa y completa.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">5. Envíos y Entregas</h2>
          <p className="mb-3">
            Realizamos envíos a direcciones dentro de Canadá y a destinos internacionales seleccionados. Los tiempos de 
            entrega son estimados basados en la información proporcionada por nuestros socios logísticos y pueden variar 
            según su ubicación, condiciones climáticas, volumen de pedidos, y otros factores externos.
          </p>
          <p className="mb-3">
            Para envíos internacionales, usted es responsable de cualquier impuesto de importación, aranceles aduaneros, 
            y cargos adicionales impuestos por las autoridades de su país. Estos cargos no están bajo nuestro control y 
            no están incluidos en el precio de compra.
          </p>
          <p className="mb-3">
            El riesgo de pérdida y título de propiedad de los productos pasa a usted en el momento de la entrega. Es su 
            responsabilidad inspeccionar los productos a la recepción y notificar cualquier daño o discrepancia dentro 
            de las 48 horas siguientes a la entrega.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">6. Política de Devoluciones y Reembolsos</h2>
          <p className="mb-3">
            De conformidad con la Ley de Protección al Consumidor de Canadá y las leyes provinciales aplicables, ofrecemos 
            una política de devolución que permite devolver la mayoría de los productos dentro de los 30 días siguientes 
            a la recepción, siempre que se cumplan las siguientes condiciones:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>El producto debe estar en su estado original, sin usar y con todas las etiquetas y embalajes originales.</li>
            <li>Debe incluirse el comprobante de compra o confirmación de pedido.</li>
            <li>Los artículos personalizados, perecederos, de higiene personal o marcados como ventas finales no son elegibles para devolución, salvo en caso de defectos comprobables.</li>
          </ul>
          <p className="mb-3 mt-3">
            Los reembolsos se procesarán utilizando el mismo método de pago utilizado para la compra original dentro de los 
            14 días hábiles siguientes a la recepción y verificación de los artículos devueltos. Los gastos de envío 
            originales y de devolución generalmente no son reembolsables, excepto en casos de productos defectuosos o 
            errores de envío atribuibles a nuestra responsabilidad.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">7. Propiedad Intelectual</h2>
          <p className="mb-3">
            La Plataforma y todo su contenido, características y funcionalidades, incluyendo pero no limitado a texto, 
            gráficos, logotipos, iconos, imágenes, clips de audio, descargas digitales, compilaciones de datos y software, 
            son propiedad exclusiva de Tout à un clic là, sus licenciantes u otros proveedores de contenido, y están 
            protegidos por las leyes canadienses e internacionales de derechos de autor, marcas registradas, patentes, 
            secretos comerciales y otros derechos de propiedad intelectual.
          </p>
          <p className="mb-3">
            Queda estrictamente prohibido el uso no autorizado de cualquier contenido o material en nuestra Plataforma. 
            No se concede licencia implícita o expresa para utilizar cualquier propiedad intelectual sin nuestro 
            consentimiento previo por escrito.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">8. Limitación de Responsabilidad</h2>
          <p className="mb-3">
            En la máxima medida permitida por la ley aplicable, Tout à un clic là, sus directores, empleados, agentes y 
            afiliados no serán responsables por:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Daños indirectos, incidentales, especiales, punitivos o consecuentes, incluyendo pérdida de ganancias, 
                datos, uso o cualquier otra pérdida intangible, resultantes de (i) su acceso o uso o incapacidad para 
                acceder o usar nuestra Plataforma; (ii) cualquier conducta o contenido de terceros en la Plataforma; o 
                (iii) acceso no autorizado, uso o alteración de sus transmisiones o contenido.</li>
            <li>Interrupciones, errores, omisiones, o retrasos en la operación de la Plataforma o la entrega de 
                productos o servicios.</li>
            <li>Virus, troyanos u otro software malicioso que pueda transmitirse a o a través de nuestra Plataforma.</li>
          </ul>
          <p className="mb-3 mt-3">
            Nuestra responsabilidad total por cualquier reclamación bajo estos Términos no excederá el monto pagado por 
            usted a Tout à un clic là durante los seis (6) meses anteriores a la acción que da lugar a dicha responsabilidad.
          </p>
          <p className="mb-3">
            Las limitaciones anteriores se aplicarán independientemente de si se ha advertido a Tout à un clic là sobre 
            la posibilidad de tales daños e independientemente de si cualquier recurso establecido en este documento 
            falla en su propósito esencial.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">9. Ley Aplicable y Resolución de Disputas</h2>
          <p className="mb-3">
            Estos Términos de Servicio se regirán e interpretarán de acuerdo con las leyes de la provincia de Quebec y 
            las leyes federales de Canadá aplicables en ella, sin tener en cuenta sus principios de conflicto de leyes.
          </p>
          <p className="mb-3">
            Cualquier disputa, controversia o reclamación que surja de o en relación con estos Términos, o su 
            incumplimiento, terminación o invalidez, se resolverá mediante negociación de buena fe. Si la disputa no 
            puede resolverse mediante negociación, ambas partes acuerdan someter la disputa a mediación de acuerdo con 
            las reglas de mediación del Instituto de Mediación y Arbitraje de Canadá.
          </p>
          <p className="mb-3">
            Si la mediación no resuelve la disputa, esta será sometida a arbitraje vinculante ante un solo árbitro de 
            conformidad con la Ley de Arbitraje Comercial de Canadá. El lugar del arbitraje será Montreal, Quebec, Canadá, 
            y el idioma del arbitraje será el inglés o el francés, según lo acordado por las partes.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">10. Cambios a los Términos</h2>
          <p className="mb-3">
            Nos reservamos el derecho, a nuestra exclusiva discreción, de modificar o reemplazar estos Términos en 
            cualquier momento. La versión actualizada será efectiva tan pronto como se publique en nuestra Plataforma. 
            Es su responsabilidad revisar periódicamente estos Términos para estar informado de cualquier cambio.
          </p>
          <p className="mb-3">
            El uso continuado de nuestra Plataforma después de la publicación de cualquier modificación constituye la 
            aceptación de dichas modificaciones. Si no está de acuerdo con los nuevos términos, debe dejar de utilizar 
            nuestra Plataforma.
          </p>
          <p className="mb-3">
            Para cambios sustanciales, haremos esfuerzos razonables para notificarle, ya sea a través de un aviso 
            prominente en nuestra Plataforma, por correo electrónico a la dirección asociada con su cuenta, o por 
            otros medios.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">11. Contacto</h2>
          <p className="mb-3">
            Si tiene preguntas sobre estos Términos de Servicio o necesita asistencia con nuestros productos o servicios, 
            puede contactarnos a través de:
          </p>
          <p className="mb-3">
            <a href="mailto:serviceclient@toutaunclicla.com" className="text-indigo-600 hover:underline">serviceclient@toutaunclicla.com</a>
          </p>
          <p className="mb-3">
            Nuestro equipo de atención al cliente está disponible para asistirle de lunes a viernes, de 9:00 a.m. a 5:00 p.m. 
            (hora del Este).
          </p>
        </section>
      </div>
      
      <div className="mt-12 text-sm text-gray-500 dark:text-gray-400 text-center">
        <p>Última actualización: {new Date().toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
      </div>
    </div>
  );
} 