import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Tout à un clic là',
  description: 'Información sobre cómo recopilamos, utilizamos y protegemos sus datos personales conforme a la legislación canadiense',
};

export default function PoliticasPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-indigo-600">Política de Privacidad</h1>
      
      <div className="space-y-8 text-gray-700 dark:text-gray-300">
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">1. Introducción</h2>
          <p className="mb-3">
            En Tout à un clic là, respetamos su privacidad y nos comprometemos a proteger sus datos personales de conformidad 
            con la Ley de Protección de Información Personal y Documentos Electrónicos (PIPEDA) de Canadá. Esta política 
            de privacidad detalla cómo recopilamos, utilizamos, protegemos y divulgamos la información personal que nos 
            proporciona al utilizar nuestra plataforma de comercio electrónico, así como sus derechos de privacidad según 
            la legislación canadiense.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">2. Datos que Recopilamos</h2>
          <p className="mb-3">
            De acuerdo con los principios de privacidad establecidos por la PIPEDA, recopilamos únicamente la información 
            personal necesaria para los fines identificados y con su consentimiento. Esta información puede incluir:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Datos de identidad:</strong> nombre completo, nombre de usuario o identificadores similares.</li>
            <li><strong>Datos de contacto:</strong> dirección postal, dirección de facturación, dirección de entrega, correo electrónico y números de teléfono.</li>
            <li><strong>Datos financieros:</strong> información de tarjetas de pago (procesada de forma segura a través de proveedores de pago autorizados y cumpliendo con los estándares PCI DSS).</li>
            <li><strong>Datos de transacción:</strong> registros de compras, productos adquiridos, frecuencia de compras y métodos de pago utilizados.</li>
            <li><strong>Datos técnicos:</strong> dirección IP, datos de inicio de sesión, tipo y versión del navegador, configuración de zona horaria, ubicación, tipos de dispositivos utilizados para acceder a la plataforma.</li>
            <li><strong>Datos de perfil:</strong> nombre de usuario y contraseña (almacenada de forma encriptada), preferencias de compra, intereses, y respuestas a encuestas cuando haya decidido participar en ellas.</li>
            <li><strong>Datos de uso:</strong> información sobre cómo navega y utiliza nuestra plataforma, incluyendo tiempo de permanencia en páginas y patrones de navegación.</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">3. Cómo Utilizamos sus Datos</h2>
          <p className="mb-3">
            Utilizamos su información personal únicamente para los fines específicos para los que fue recopilada y de conformidad 
            con la PIPEDA y otras leyes canadienses aplicables. Estos fines incluyen:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Administrar su cuenta y nuestra relación contractual, incluyendo la verificación de su identidad cuando sea necesario.</li>
            <li>Procesar y entregar sus pedidos, incluyendo la gestión de pagos, facturación y envíos.</li>
            <li>Administrar nuestra plataforma digital (incluyendo análisis de datos, pruebas, mantenimiento de sistemas, soporte técnico, y seguridad informática).</li>
            <li>Mejorar nuestros productos y servicios mediante el análisis de patrones de uso y preferencias de los clientes.</li>
            <li>Comunicarnos con usted sobre actualizaciones de productos, ofertas especiales o información relevante, siempre con la opción de darse de baja de estas comunicaciones.</li>
            <li>Cumplir con obligaciones legales y fiscales según lo requiera la legislación canadiense.</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">4. Cookies y Tecnologías de Seguimiento</h2>
          <p className="mb-3">
            Utilizamos cookies y tecnologías similares de conformidad con las leyes canadienses de privacidad electrónica. 
            Estas tecnologías nos permiten:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Recordar sus preferencias y ajustes para mejorar su experiencia.</li>
            <li>Entender cómo utiliza nuestra plataforma para optimizarla.</li>
            <li>Facilitar funcionalidades esenciales como el carrito de compra y la autenticación de sesiones.</li>
          </ul>
          <p className="mb-3 mt-3">
            Puede configurar su navegador para rechazar todas o algunas cookies, o para alertarle cuando se utilizan. 
            Sin embargo, esto podría afectar el funcionamiento de ciertas partes de nuestra plataforma. Al continuar 
            utilizando nuestro sitio sin cambiar su configuración, usted consiente nuestro uso de cookies según lo 
            descrito en esta política.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">5. Divulgación de sus Datos Personales</h2>
          <p className="mb-3">
            De acuerdo con la legislación canadiense, podemos compartir su información personal solo en circunstancias específicas:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Con proveedores de servicios que nos asisten en nuestras operaciones comerciales (procesadores de pago, servicios de entrega, proveedores de alojamiento web) bajo estrictos acuerdos de confidencialidad.</li>
            <li>Con profesionales como asesores legales, contadores y auditores cuando sea necesario para nuestras operaciones comerciales.</li>
            <li>Con autoridades gubernamentales cuando sea requerido por ley, regulación o proceso legal.</li>
            <li>En el contexto de una transacción comercial como fusión, adquisición o venta de activos, con notificación previa a los usuarios afectados.</li>
          </ul>
          <p className="mt-3">
            Exigimos a todos los terceros que respeten la confidencialidad y seguridad de sus datos personales y que cumplan 
            con todas las leyes de privacidad aplicables, incluyendo la PIPEDA. No permitimos que nuestros proveedores de 
            servicios utilicen sus datos para fines propios no autorizados.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">6. Transferencias Internacionales de Datos</h2>
          <p className="mb-3">
            Si transferimos sus datos personales fuera de Canadá, lo hacemos únicamente cuando existen garantías adecuadas para 
            proteger sus derechos de privacidad, de conformidad con los requisitos de la PIPEDA. Estas garantías pueden incluir:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Transferencias a países que el Comisionado de Privacidad de Canadá ha determinado que ofrecen un nivel adecuado de protección.</li>
            <li>Implementación de cláusulas contractuales aprobadas.</li>
            <li>Obtención de su consentimiento explícito cuando sea necesario.</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">7. Seguridad de Datos</h2>
          <p className="mb-3">
            Hemos implementado medidas de seguridad técnicas y organizativas apropiadas según los estándares de la industria 
            canadiense para proteger sus datos personales contra accesos no autorizados, alteraciones, divulgaciones o 
            destrucciones. Estas medidas incluyen:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Encriptación de datos sensibles y transacciones financieras.</li>
            <li>Sistemas de firewall y detección de intrusiones.</li>
            <li>Acceso restringido a la información personal basado en necesidad de conocimiento.</li>
            <li>Evaluaciones regulares de seguridad y auditorías de cumplimiento.</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">8. Retención de Datos</h2>
          <p className="mb-3">
            Conservamos sus datos personales únicamente durante el tiempo necesario para los fines para los que fueron 
            recopilados, de acuerdo con nuestras obligaciones legales y comerciales. Los criterios utilizados para determinar 
            nuestros períodos de retención incluyen:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>El período durante el cual mantenemos una relación comercial activa con usted.</li>
            <li>Nuestras obligaciones legales según la legislación canadiense aplicable, incluyendo normativas fiscales y comerciales.</li>
            <li>Requisitos para la resolución de disputas o reclamaciones.</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">9. Sus Derechos Legales</h2>
          <p className="mb-3">
            Bajo la PIPEDA y otras leyes canadienses de privacidad, usted tiene derechos específicos con respecto a sus 
            datos personales, que incluyen:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Derecho de acceso:</strong> Solicitar acceso a sus datos personales que procesamos.</li>
            <li><strong>Derecho de rectificación:</strong> Solicitar la corrección de información inexacta o incompleta.</li>
            <li><strong>Derecho a retirar el consentimiento:</strong> Retirar su consentimiento en cualquier momento cuando el procesamiento se base en su consentimiento.</li>
            <li><strong>Derecho a presentar una queja:</strong> Presentar una reclamación ante la Oficina del Comisionado de Privacidad de Canadá si considera que hemos infringido sus derechos de privacidad.</li>
            <li><strong>Derecho a impugnar el cumplimiento:</strong> Cuestionar nuestro cumplimiento de los principios de la PIPEDA.</li>
          </ul>
          <p className="mt-3">
            Para ejercer cualquiera de estos derechos, contáctenos utilizando la información proporcionada en la sección "Contacto".
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">10. Cambios a esta Política de Privacidad</h2>
          <p className="mb-3">
            Podemos actualizar esta política de privacidad periódicamente para reflejar cambios en nuestras prácticas o en 
            la legislación canadiense. La versión más reciente estará siempre disponible en nuestra plataforma, con la 
            fecha de actualización claramente indicada. Para cambios significativos, proporcionaremos notificaciones visibles 
            en nuestra plataforma o le enviaremos comunicaciones directas.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">11. Contacto</h2>
          <p className="mb-3">
            Para cualquier consulta relacionada con esta política de privacidad o el tratamiento de sus datos personales, puede 
            contactarnos a través de:
          </p>
          <p className="mb-3">
            <a href="mailto:serviceclient@toutaunclicla.com" className="text-indigo-600 hover:underline">serviceclient@toutaunclicla.com</a>
          </p>
          <p className="mb-3">
            Si considera que no hemos abordado adecuadamente sus preocupaciones, tiene derecho a presentar una queja ante 
            la Oficina del Comisionado de Privacidad de Canadá: <a href="https://www.priv.gc.ca" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">www.priv.gc.ca</a>
          </p>
        </section>
      </div>
      
      <div className="mt-12 text-sm text-gray-500 dark:text-gray-400 text-center">
        <p>Última actualización: {new Date().toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
      </div>
    </div>
  );
} 