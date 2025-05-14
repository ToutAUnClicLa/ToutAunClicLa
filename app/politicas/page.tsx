import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad | A un clic la',
  description: 'Información sobre cómo recopilamos, utilizamos y protegemos sus datos personales',
};

export default function PoliticasPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-indigo-600">Política de Privacidad</h1>
      
      <div className="space-y-8 text-gray-700 dark:text-gray-300">
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">1. Introducción</h2>
          <p className="mb-3">
            En A un clic la, respetamos su privacidad y nos comprometemos a proteger sus datos personales. Esta política 
            de privacidad le informará sobre cómo cuidamos sus datos personales cuando visita nuestro sitio web y le 
            informará sobre sus derechos de privacidad y cómo la ley le protege.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">2. Datos que Recopilamos</h2>
          <p className="mb-3">
            Podemos recopilar, utilizar, almacenar y transferir diferentes tipos de datos personales sobre usted, que 
            hemos agrupado de la siguiente manera:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Datos de identidad:</strong> incluye nombre, apellido, nombre de usuario o identificador similar.</li>
            <li><strong>Datos de contacto:</strong> incluye dirección de facturación, dirección de entrega, dirección de correo electrónico y números de teléfono.</li>
            <li><strong>Datos financieros:</strong> incluye detalles de tarjetas de pago (procesados de forma segura a través de nuestros proveedores de pago).</li>
            <li><strong>Datos de transacción:</strong> incluye detalles sobre pagos hacia y desde usted, y otros detalles de productos y servicios que ha comprado de nosotros.</li>
            <li><strong>Datos técnicos:</strong> incluye dirección IP, datos de inicio de sesión, tipo y versión del navegador, configuración de zona horaria y ubicación, tipos y versiones de plugins del navegador, sistema operativo y plataforma.</li>
            <li><strong>Datos de perfil:</strong> incluye su nombre de usuario y contraseña, compras o pedidos realizados por usted, sus intereses, preferencias, comentarios y respuestas a encuestas.</li>
            <li><strong>Datos de uso:</strong> incluye información sobre cómo utiliza nuestro sitio web, productos y servicios.</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">3. Cómo Utilizamos sus Datos</h2>
          <p className="mb-3">
            Utilizaremos sus datos personales solo cuando la ley nos lo permita. Más comúnmente, utilizaremos sus datos 
            personales en las siguientes circunstancias:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Para registrar su cuenta y gestionar nuestra relación con usted.</li>
            <li>Para procesar y entregar sus pedidos, incluyendo la gestión de pagos y cobros.</li>
            <li>Para gestionar nuestro negocio y este sitio web (incluyendo resolución de problemas, análisis de datos, pruebas, mantenimiento del sistema, soporte, informes y alojamiento de datos).</li>
            <li>Para proporcionarle contenido relevante del sitio web y medir o comprender la efectividad de la publicidad que le servimos.</li>
            <li>Para hacer sugerencias y recomendaciones sobre productos o servicios que puedan interesarle.</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">4. Cookies</h2>
          <p className="mb-3">
            Utilizamos cookies y tecnologías similares para distinguirle de otros usuarios de nuestro sitio web. Esto 
            nos ayuda a proporcionarle una buena experiencia cuando navega por nuestro sitio web y también nos permite 
            mejorarlo.
          </p>
          <p className="mb-3">
            Puede configurar su navegador para rechazar todas o algunas cookies del navegador, o para alertarle cuando 
            los sitios web establezcan o accedan a cookies. Si deshabilita o rechaza las cookies, tenga en cuenta que 
            algunas partes de este sitio web pueden volverse inaccesibles o no funcionar correctamente.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">5. Divulgación de sus Datos Personales</h2>
          <p className="mb-3">
            Podemos compartir sus datos personales con las partes que se indican a continuación para los fines establecidos 
            en esta política de privacidad:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Proveedores de servicios que proporcionan servicios de TI y administración de sistemas.</li>
            <li>Asesores profesionales, incluyendo abogados, banqueros, auditores y aseguradores.</li>
            <li>Autoridades fiscales, reguladoras y otras autoridades.</li>
            <li>Terceros a quienes podemos elegir vender, transferir o fusionar partes de nuestro negocio o nuestros activos.</li>
          </ul>
          <p className="mt-3">
            Exigimos a todos los terceros que respeten la seguridad de sus datos personales y los traten de acuerdo con 
            la ley. No permitimos que nuestros proveedores de servicios externos utilicen sus datos personales para sus 
            propios fines y solo les permitimos procesar sus datos personales para fines específicos y de acuerdo con 
            nuestras instrucciones.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">6. Seguridad de Datos</h2>
          <p className="mb-3">
            Hemos implementado medidas de seguridad apropiadas para evitar que sus datos personales se pierdan, utilicen 
            o accedan accidentalmente de manera no autorizada, se alteren o divulguen. Además, limitamos el acceso a sus 
            datos personales a aquellos empleados, agentes, contratistas y otros terceros que tengan una necesidad comercial 
            de conocerlos.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">7. Retención de Datos</h2>
          <p className="mb-3">
            Solo conservaremos sus datos personales durante el tiempo necesario para cumplir con los fines para los que 
            los recopilamos, incluyendo para satisfacer cualquier requisito legal, contable o de informes.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">8. Sus Derechos Legales</h2>
          <p className="mb-3">
            Bajo ciertas circunstancias, tiene derechos bajo las leyes de protección de datos en relación con sus datos 
            personales, incluyendo el derecho a:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Solicitar acceso a sus datos personales.</li>
            <li>Solicitar la corrección de sus datos personales.</li>
            <li>Solicitar la eliminación de sus datos personales.</li>
            <li>Oponerse al procesamiento de sus datos personales.</li>
            <li>Solicitar la restricción del procesamiento de sus datos personales.</li>
            <li>Solicitar la transferencia de sus datos personales.</li>
            <li>Retirar el consentimiento en cualquier momento.</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">9. Cambios a esta Política de Privacidad</h2>
          <p className="mb-3">
            Podemos actualizar nuestra política de privacidad de vez en cuando. Publicaremos cualquier cambio en esta 
            página y, si los cambios son significativos, le proporcionaremos un aviso más prominente.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">10. Contacto</h2>
          <p className="mb-3">
            Si tiene alguna pregunta sobre esta política de privacidad o nuestras prácticas de privacidad, contáctenos en:
          </p>
          <p className="mb-3">
            <a href="mailto:privacidad@aunclic.com" className="text-indigo-600 hover:underline">privacidad@aunclic.com</a>
          </p>
        </section>
      </div>
      
      <div className="mt-12 text-sm text-gray-500 dark:text-gray-400 text-center">
        <p>Última actualización: {new Date().toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
      </div>
    </div>
  );
} 