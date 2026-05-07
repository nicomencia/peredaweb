import './SimplePage.css';

function LegalPage({ title, children }) {
  return (
    <div className="simple-page">
      <div className="simple-page-hero">
        <h1 className="simple-page-hero-title">{title}</h1>
      </div>
      <section className="simple-page-content">
        <div className="simple-page-container">
          <div className="legal-content">{children}</div>
        </div>
      </section>
    </div>
  );
}

export function AvisoLegal() {
  return (
    <LegalPage title="aviso legal">
      <h2>Ley de los Servicios de la Sociedad de la Información (LSSI)</h2>
      <p>
        SANEAMIENTOS PEREDA SA, responsable del sitio web, en adelante RESPONSABLE, pone a
        disposición de los usuarios el presente documento, con el que pretende dar cumplimiento a
        las obligaciones dispuestas en la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad
        de la Información y de Comercio Electrónico (LSSICE), BOE N º 166, así como informar a
        todos los usuarios del sitio web respecto a cuáles son las condiciones de uso.
      </p>
      <p>
        Toda persona que acceda a este sitio web asume el papel de usuario, comprometiéndose a la
        observancia y cumplimiento riguroso de las disposiciones aquí dispuestas, así como a
        cualquier otra disposición legal que fuera de aplicación.
      </p>
      <p>
        SANEAMIENTOS PEREDA SA se reserva el derecho de modificar cualquier tipo de información
        que pudiera aparecer en el sitio web, sin que exista obligación de preavisar o poner en
        conocimiento de los usuarios dichas obligaciones, entendiéndose como suficiente con la
        publicación en el sitio web de SANEAMIENTOS PEREDA SA.
      </p>

      <h2>1. Datos identificativos</h2>
      <p>
        Nombre de dominio: https://www.saneamientos-pereda.com<br />
        Nombre comercial: SANEAMIENTOS PEREDA SA<br />
        Denominación social: SANEAMIENTOS PEREDA SA<br />
        NIF: A33094830<br />
        Domicilio social: CALLE INDEPENDENCIA 43 BAJO, 33004 OVIEDO (ASTURIAS)<br />
        Teléfono: 985271026<br />
        e-mail: marketing@saneamientos-pereda.com<br />
        Inscrita en el Registro (Mercantil / Público): REGISTRO MERCANTIL DE ASTURIAS TOMO 725
        FOLIO 136 HOJA AS-27
      </p>

      <h2>2. Derechos de propiedad intelectual e industrial</h2>
      <p>
        El sitio web, incluyendo a título enunciativo pero no limitativo su programación, edición,
        compilación y demás elementos necesarios para su funcionamiento, los diseños, logotipos,
        texto y/o gráficos, son propiedad del RESPONSABLE o, si es el caso, dispone de licencia o
        autorización expresa por parte de los autores. Todos los contenidos del sitio web se
        encuentran debidamente protegidos por la normativa de propiedad intelectual e industrial,
        así como inscritos en los registros públicos correspondientes. Independientemente de la
        finalidad para la que fueran destinados, la reproducción total o parcial, uso, explotación,
        distribución y comercialización, requiere en todo caso de la autorización escrita previa
        por parte del RESPONSABLE. Cualquier uso no autorizado previamente se considera un
        incumplimiento grave de los derechos de propiedad intelectual o industrial del autor.
      </p>
      <p>
        Los diseños, logotipos, texto y/o gráficos ajenos al RESPONSABLE y que pudieran aparecer en
        el sitio web, pertenecen a sus respectivos propietarios, siendo ellos mismos responsables
        de cualquier posible controversia que pudiera suscitarse respecto a los mismos. El
        RESPONSABLE autoriza expresamente a que terceros puedan redirigir directamente a los
        contenidos concretos del sitio web, y en todo caso redirigir al sitio web principal de
        https://www.saneamientos-pereda.com.
      </p>
      <p>
        El RESPONSABLE reconoce a favor de sus titulares los correspondientes derechos de
        propiedad intelectual e industrial, no implicando su sola mención o aparición en el sitio
        web la existencia de derechos o responsabilidad alguna sobre los mismos, como tampoco
        respaldo, patrocinio o recomendación por parte del mismo.
      </p>
      <p>
        Para realizar cualquier tipo de observación respecto a posibles incumplimientos de los
        derechos de propiedad intelectual o industrial, así como sobre cualquiera de los contenidos
        del sitio web, puede hacerlo a través del correo electrónico marketing@saneamientos-pereda.com.
      </p>

      <h2>3. Exención de responsabilidades</h2>
      <p>
        El RESPONSABLE se exime de cualquier tipo de responsabilidad derivada de la información
        publicada en su sitio web siempre que esta información haya sido manipulada o introducida
        por un tercero ajeno al mismo.
      </p>
      <h3>Uso de Cookies</h3>
      <p>
        Este sitio web puede utilizar cookies técnicas (pequeños archivos de información que el
        servidor envía al ordenador de quien accede a la página) para llevar a cabo determinadas
        funciones que son consideradas imprescindibles para el correcto funcionamiento y
        visualización del sitio. Las cookies utilizadas tienen, en todo caso, carácter temporal,
        con la única finalidad de hacer más eficaz la navegación, y desaparecen al terminar la
        sesión del usuario. En ningún caso, estas cookies proporcionan por sí mismas datos de
        carácter personal y no se utilizarán para la recogida de los mismos.
      </p>
      <p>
        Mediante el uso de cookies también es posible que el servidor donde se encuentra la web
        reconozca el navegador utilizado por el usuario con la finalidad de que la navegación sea
        más sencilla, permitiendo, por ejemplo, el acceso de los usuarios que se hayan registrado
        previamente a las áreas, servicios, promociones o concursos reservados exclusivamente a
        ellos sin tener que registrarse en cada visita. También se pueden utilizar para medir la
        audiencia, parámetros de tráfico, controlar el progreso y número de entradas, etc, siendo
        en estos casos cookies prescindibles técnicamente pero beneficiosas para el usuario. Este
        sitio web no instalará cookies prescindibles sin el consentimiento previo del usuario.
      </p>
      <p>
        El usuario tiene la posibilidad de configurar su navegador para ser alertado de la
        recepción de cookies y para impedir su instalación en su equipo. Por favor, consulte las
        instrucciones de su navegador para ampliar esta información.
      </p>
      <h3>Política de enlaces</h3>
      <p>
        Desde el sitio web, es posible que se redirija a contenidos de terceros sitios web. Dado
        que el RESPONSABLE no puede controlar siempre los contenidos introducidos por los terceros
        en sus respectivos sitios web, no asume ningún tipo de responsabilidad respecto a dichos
        contenidos. En todo caso, procederá a la retirada inmediata de cualquier contenido que
        pudiera contravenir la legislación nacional o internacional, la moral o el orden público,
        procediendo a la retirada inmediata de la redirección a dicho sitio web, poniendo en
        conocimiento de las autoridades competentes el contenido en cuestión.
      </p>
      <p>
        El RESPONSABLE no se hace responsable de la información y contenidos almacenados, a título
        enunciativo pero no limitativo, en foros, chats, generadores de blogs, comentarios, redes
        sociales o cualquier otro medio que permita a terceros publicar contenidos de forma
        independiente en la página web del RESPONSABLE. Sin embargo, y en cumplimiento de lo
        dispuesto en los artículos 11 y 16 de la LSSICE, se pone a disposición de todos los
        usuarios, autoridades y fuerzas de seguridad, colaborando de forma activa en la retirada
        o, en su caso, bloqueo de todos aquellos contenidos que puedan afectar o contravenir la
        legislación nacional o internacional, los derechos de terceros o la moral y el orden
        público. En caso de que el usuario considere que existe en el sitio web algún contenido
        que pudiera ser susceptible de esta clasificación, se ruega lo notifique de forma
        inmediata al administrador del sitio web.
      </p>
      <p>
        Este sitio web ha sido revisado y probado para que funcione correctamente. En principio,
        puede garantizarse el correcto funcionamiento los 365 días del año, 24 horas al día. Sin
        embargo, el RESPONSABLE no descarta la posibilidad de que existan ciertos errores de
        programación, o que acontezcan causas de fuerza mayor, catástrofes naturales, huelgas o
        circunstancias semejantes que hagan imposible el acceso a la página web.
      </p>
      <h3>Direcciones IP</h3>
      <p>
        Los servidores del sitio web podrán detectar de manera automática la dirección IP y el
        nombre de dominio utilizados por el usuario. Una dirección IP es un número asignado
        automáticamente a un ordenador cuando éste se conecta a Internet. Toda esta información es
        registrada en un fichero de actividad del servidor debidamente inscrito que permite el
        posterior procesamiento de los datos con el fin de obtener mediciones únicamente
        estadísticas que permitan conocer el número de impresiones de páginas, el número de
        visitas realizadas a los servidores web, el orden de visitas, el punto de acceso, etc.
      </p>

      <h2>4. Ley aplicable y jurisdicción</h2>
      <p>
        Para la resolución de todas las controversias o cuestiones relacionadas con el presente
        sitio web o de las actividades en él desarrolladas, será de aplicación la legislación
        española, a la que se someten expresamente las partes, siendo competentes para la
        resolución de todos los conflictos derivados o relacionados con su uso los Juzgados y
        Tribunales más cercanos a OVIEDO.
      </p>
    </LegalPage>
  );
}

export function PoliticaPrivacidad() {
  return (
    <LegalPage title="política de privacidad">
      <h2>1. Información al usuario</h2>
      <p>
        SANEAMIENTOS PEREDA SA, en adelante RESPONSABLE, es el Responsable del tratamiento de los
        datos personales del Usuario y le informa que estos datos serán tratados de conformidad
        con lo dispuesto en el Reglamento (UE) 2016/679 de 27 de abril (GDPR) y la Ley Orgánica
        3/2018 de 5 de diciembre (LOPDGDD), por lo que se le facilita la siguiente información
        del tratamiento:
      </p>
      <p>
        <strong>Fin del tratamiento:</strong> mantener una relación comercial con el Usuario. Las
        operaciones previstas para realizar el tratamiento son:
      </p>
      <ul>
        <li>
          Remisión de comunicaciones comerciales publicitarias por email, fax, SMS, MMS,
          comunidades sociales o cualquier otro medio electrónico o físico, presente o futuro,
          que posibilite realizar comunicaciones comerciales. Estas comunicaciones serán
          realizadas por el RESPONSABLE y relacionadas sobre sus productos y servicios, o de sus
          colaboradores o proveedores con los que éste haya alcanzado algún acuerdo de promoción.
          En este caso, los terceros nunca tendrán acceso a los datos personales.
        </li>
        <li>Realizar estudios estadísticos.</li>
        <li>
          Tramitar encargos, solicitudes o cualquier tipo de petición que sea realizada por el
          usuario a través de cualquiera de las formas de contacto que se ponen a su disposición.
        </li>
        <li>Remitir el boletín de noticias de la página web.</li>
      </ul>
      <p>
        <strong>Base jurídica del tratamiento:</strong> consentimiento del interesado.
      </p>
      <p>
        <strong>Criterios de conservación de los datos:</strong> se conservarán durante de forma
        indefinida para mantener el fin del tratamiento y cuando ya no sea necesario para tal
        fin, se suprimirán con medidas de seguridad adecuadas para garantizar la seudonimización
        de los datos o la destrucción total de los mismos.
      </p>
      <p>
        <strong>Comunicación de los datos:</strong> No se comunicarán los datos a terceros, salvo
        obligación legal.
      </p>
      <p>
        <strong>Derechos que asisten al Usuario:</strong>
      </p>
      <ul>
        <li>Derecho a retirar el consentimiento en cualquier momento.</li>
        <li>
          Derecho de acceso, rectificación, portabilidad y supresión de sus datos y a la
          limitación u oposición al su tratamiento.
        </li>
        <li>
          Derecho a presentar una reclamación ante la autoridad de control (www.aepd.es) si
          considera que el tratamiento no se ajusta a la normativa vigente.
        </li>
      </ul>
      <p>
        <strong>Datos de contacto para ejercer sus derechos:</strong>
        <br />
        SANEAMIENTOS PEREDA SA. CALLE INDEPENDENCIA, 43 BAJO – 33004 OVIEDO (Asturias). Email:
        marketing@saneaminetos-pereda.com
      </p>

      <h2>2. Carácter obligatorio o facultativo de la información facilitada por el usuario</h2>
      <p>
        Los Usuarios, mediante la marcación de las casillas correspondientes y entrada de datos
        en los campos, marcados con un asterisco (*) en el formulario de contacto o presentados
        en formularios de descarga, aceptan expresamente y de forma libre e inequívoca, que sus
        datos son necesarios para atender su petición, por parte del prestador, siendo
        voluntaria la inclusión de datos en los campos restantes. El Usuario garantiza que los
        datos personales facilitados al RESPONSABLE son veraces y se hace responsable de
        comunicar cualquier modificación de los mismos.
      </p>
      <p>
        El RESPONSABLE informa y garantiza expresamente a los usuarios que sus datos personales
        no serán cedidos en ningún caso a terceros, y que siempre que realizara algún tipo de
        cesión de datos personales, se pedirá previamente el consentimiento expreso, informado e
        inequívoco por parte los Usuarios. Todos los datos solicitados a través del sitio web
        son obligatorios, ya que son necesarios para la prestación de un servicio óptimo al
        Usuario. En caso de que no sean facilitados todos los datos, no se garantiza que la
        información y servicios facilitados sean completamente ajustados a sus necesidades.
      </p>

      <h2>3. Medidas de seguridad</h2>
      <p>
        Que de conformidad con lo dispuesto en las normativas vigentes en protección de datos
        personales, el RESPONSABLE está cumpliendo con todas las disposiciones de las normativas
        GDPR para el tratamiento de los datos personales de su responsabilidad, y manifiestamente
        con los principios descritos en el artículo 5 del GDPR, por los cuales son tratados de
        manera lícita, leal y transparente en relación con el interesado y adecuados,
        pertinentes y limitados a lo necesario en relación con los fines para los que son
        tratados.
      </p>
      <p>
        El RESPONSABLE garantiza que ha implementado políticas técnicas y organizativas
        apropiadas para aplicar las medidas de seguridad que establecen el GDPR con el fin de
        proteger los derechos y libertades de los Usuarios y les ha comunicado la información
        adecuada para que puedan ejercerlos.
      </p>
    </LegalPage>
  );
}

export function PoliticaCookies() {
  return (
    <LegalPage title="política de cookies">
      <h2>Información sobre cookies</h2>
      <p>
        Debido a la entrada en vigor de la referente modificación de la «Ley de Servicios de la
        Sociedad de la Información» (LSSICE) establecida por el Real Decreto 13/2012, es de
        obligación obtener el consentimiento expreso del usuario de todas las páginas web que
        usan cookies prescindibles, antes de que este navegue por ellas.
      </p>

      <h2>¿Qué son las cookies?</h2>
      <p>
        Las cookies y otras tecnologías similares tales como local shared objects, flash cookies
        o píxeles, son herramientas empleadas por los servidores Web para almacenar y recuperar
        información acerca de sus visitantes, así como para ofrecer un correcto funcionamiento
        del sitio. Mediante el uso de estos dispositivos se permite al servidor Web recordar
        algunos datos concernientes al usuario, como sus preferencias para la visualización de
        las páginas de ese servidor, nombre y contraseña, productos que más le interesan, etc.
      </p>

      <h2>Cookies afectadas por la normativa y cookies exceptuadas</h2>
      <p>
        Según la directiva de la UE, las cookies que requieren el consentimiento informado por
        parte del usuario son las cookies de analítica y las de publicidad y afiliación, quedando
        exceptuadas las de carácter técnico y las necesarias para el funcionamiento del sitio web
        o la prestación de servicios expresamente solicitados por el usuario.
      </p>

      <h2>Tipos de cookies</h2>
      <h3>Según la finalidad</h3>
      <p>
        <strong>Cookies técnicas y funcionales:</strong> son aquellas que permiten al usuario la
        navegación a través de una página web, plataforma o aplicación y la utilización de las
        diferentes opciones o servicios que en ella existan.
      </p>
      <p>
        <strong>Cookies analíticas:</strong> son aquellas que permiten al responsable de las
        mismas el seguimiento y análisis del comportamiento de los usuarios de los sitios web a
        los que están vinculadas. La información recogida mediante este tipo de cookies se
        utiliza en la medición de la actividad de los sitios web, aplicación o plataforma y para
        la elaboración de perfiles de navegación de los usuarios de dichos sitios, aplicaciones y
        plataformas, con el fin de introducir mejoras en función del análisis de los datos de uso
        que hacen los usuarios del servicio.
      </p>
      <p>
        <strong>Cookies publicitarias:</strong> son aquellas que permiten la gestión, de la forma
        más eficaz posible, de los espacios publicitarios que, en su caso, el editor haya
        incluido en una página web, aplicación o plataforma desde la que presta el servicio
        solicitado en base a criterios como el contenido editado o la frecuencia en la que se
        muestran los anuncios.
      </p>
      <p>
        <strong>Cookies de publicidad comportamental:</strong> recogen información sobre las
        preferencias y elecciones personales del usuario (retargeting) para permitir la gestión,
        de la forma más eficaz posible, de los espacios publicitarios que, en su caso, el editor
        haya incluido en una página web, aplicación o plataforma desde la que presta el servicio
        solicitado.
      </p>
      <p>
        <strong>Cookies sociales:</strong> son establecidas por las plataformas de redes sociales
        en los servicios para permitirle compartir contenido con sus amigos y redes. Las
        plataformas de medios sociales tienen la capacidad de rastrear su actividad en línea
        fuera de los Servicios. Esto puede afectar al contenido y los mensajes que ve en otros
        servicios que visita.
      </p>
      <p>
        <strong>Cookies de afiliados:</strong> permiten hacer un seguimiento de las visitas
        procedentes de otras webs, con las que el sitio web establece un contrato de afiliación
        (empresas de afiliación).
      </p>
      <p>
        <strong>Cookies de seguridad:</strong> almacenan información cifrada para evitar que los
        datos guardados en ellas sean vulnerables a ataques maliciosos de terceros.
      </p>

      <h3>Según la propiedad</h3>
      <p>
        <strong>Cookies propias:</strong> son aquellas que se envían al equipo terminal del
        usuario desde un equipo o dominio gestionado por el propio editor y desde el que se
        presta el servicio solicitado por el usuario.
      </p>
      <p>
        <strong>Cookies de terceros:</strong> son aquellas que se envían al equipo terminal del
        usuario desde un equipo o dominio que no es gestionado por el editor, sino por otra
        entidad que trata los datos obtenidos través de las cookies.
      </p>

      <h3>Según el plazo de conservación</h3>
      <p>
        <strong>Cookies de sesión:</strong> son un tipo de cookies diseñadas para recabar y
        almacenar datos mientras el usuario accede a una página web.
      </p>
      <p>
        <strong>Cookies persistentes:</strong> son un tipo de cookies en el que los datos siguen
        almacenados en el terminal y pueden ser accedidos y tratados durante un período definido
        por el responsable de la cookie, y que puede ir de unos minutos a varios años.
      </p>

      <h2>Tratamiento de datos personales</h2>
      <p>
        SANEAMIENTOS PEREDA SA es el Responsable del tratamiento de los datos personales del
        Interesado y le informa de que estos datos serán tratados de conformidad con lo dispuesto
        en el Reglamento (UE) 2016/679, de 27 de abril de 2016 (GDPR), por lo que se le facilita
        la siguiente información del tratamiento: Fines del tratamiento: según se especifica en
        el apartado de cookies que se utilizan en este sitio web. Legitimación del tratamiento:
        por consentimiento del interesado (art. 6.1 GDPR). Criterios de conservación de los
        datos: según se especifica en el apartado de cookies utilizadas en la web. Comunicación
        de los datos: no se comunicarán los datos a terceros, excepto en cookies propiedad de
        terceros o por obligación legal.
      </p>
      <p>
        <strong>Derechos que asisten al Interesado:</strong>
      </p>
      <ul>
        <li>Derecho a retirar el consentimiento en cualquier momento.</li>
        <li>
          Derecho de acceso, rectificación, portabilidad y supresión de sus datos, y de
          limitación u oposición a su tratamiento.
        </li>
        <li>
          Derecho a presentar una reclamación ante la Autoridad de control (www.aepd.es) si
          considera que el tratamiento no se ajusta a la normativa vigente.
        </li>
      </ul>
      <p>
        <strong>Datos de contacto para ejercer sus derechos:</strong>
        <br />
        SANEAMIENTOS PEREDA SA. CALLE INDEPENDENCIA, 43 BAJO – 33004 OVIEDO (Asturias). Email:
        consultas@saneamientos-pereda.com
      </p>
    </LegalPage>
  );
}

export function CondicionesVenta() {
  return (
    <LegalPage title="condiciones generales de venta">
      <h2>Introducción</h2>
      <p>
        Este documento contractual regirá las Condiciones Generales de contratación de productos
        o servicios (en adelante, «Condiciones») a través del sitio web saneamientospereda.com,
        propiedad de SANEAMIENTOS PEREDA SA, en adelante, PRESTADOR, cuyos datos de contacto
        figuran también en el Aviso Legal de esta Web.
      </p>
      <p>
        Estas Condiciones podrán ser modificadas en cualquier momento. Es responsabilidad del
        USUARIO leerlas periódicamente, ya que resultarán aplicables aquellas que se encuentren
        vigentes en el momento de realización de pedidos.
      </p>
      <p>
        Los contratos no estarán sujetos a formalidad alguna con excepción de los supuestos
        expresamente señalados en los Códigos Civil y de Comercio y en esta o en otras leyes
        especiales.
      </p>
      <p>La aceptación de este documento conlleva que el USUARIO:</p>
      <ul>
        <li>Ha leído, entiende y comprende lo aquí expuesto.</li>
        <li>Es una persona con capacidad suficiente para contratar.</li>
        <li>Asume todas las obligaciones aquí dispuestas.</li>
      </ul>
      <p>
        Estas condiciones tendrán un período de validez indefinido y serán aplicables a todas las
        contrataciones realizadas a través del sitio web del PRESTADOR.
      </p>
      <p>
        El PRESTADOR informa de que el comercio es responsable y conoce la legislación vigente de
        los países a los que envía los productos, y se reserva el derecho de modificar
        unilateralmente las condiciones, sin que ello pueda afectar a los bienes o promociones
        que fueron adquiridos previamente a la modificación.
      </p>

      <h2>Identidad de las partes contratantes</h2>
      <p>
        Por un lado, el PRESTADOR de los productos o servicios contratados por el USUARIO es
        SANEAMIENTOS PEREDA SA, con domicilio social en CALLE INDEPENDENCIA, 43 – BAJO 33004
        OVIEDO (Asturias), NIF A33094830 y con teléfono de atención al cliente/USUARIO 985271026.
      </p>
      <p>
        Y de otro, el USUARIO, registrado en el sitio web mediante un nombre de usuario y
        contraseña, sobre los que tiene responsabilidad plena de uso y custodia, y es responsable
        de la veracidad de los datos personales facilitados al PRESTADOR.
      </p>

      <h2>Objeto del contrato</h2>
      <p>
        El presente contrato tiene por objeto regular la relación contractual de compraventa
        nacida entre el PRESTADOR y el USUARIO en el momento en que este acepta durante el
        proceso de contratación en línea la casilla correspondiente.
      </p>
      <p>
        La relación contractual de compraventa conlleva la entrega, a cambio de un precio
        determinado y públicamente expuesto a través del sitio web, de un producto o servicio
        concreto.
      </p>

      <h2>Procedimiento de contratación</h2>
      <p>
        El USUARIO, para poder acceder a los productos o servicios que ofrece el PRESTADOR,
        deberá ser mayor de edad y darse de alta a través del sitio web mediante la creación de
        una cuenta de usuario o como usuario invitado. Por ello, el USUARIO deberá proporcionar
        de manera libre y voluntaria los datos personales que se le requerirán, los cuales se
        tratarán de conformidad con lo dispuesto en el Reglamento (UE) 2016/679, de 27 de abril
        de 2016 (GDPR), relativo a la protección de las personas físicas en lo que respecta al
        tratamiento de datos personales y a la libre circulación de estos datos y la Ley
        Orgánica 3/2018, de 5 de diciembre (LOPDGDD), relativa a la protección de datos de
        carácter personal y detallada en el Aviso legal y en la Política de privacidad de este
        sitio web.
      </p>
      <p>
        El USUARIO seleccionará un nombre de usuario y una contraseña, comprometiéndose a hacer
        un uso diligente de los mismos y a no ponerlos a disposición de terceros, así como a
        comunicar al PRESTADOR la pérdida o robo de los mismos o el posible acceso por un tercero
        no autorizado, de manera que este proceda al bloqueo inmediato.
      </p>
      <p>
        Una vez ha sido creada la cuenta de usuario, se informa de que conforme a lo que exige el
        artículo 27 de la Ley 34/2002, de Servicios de la Sociedad de la Información y del
        Comercio Electrónico (LSSICE), el procedimiento de contratación seguirá los siguientes
        pasos:
      </p>
      <ol>
        <li>Cláusulas generales de contratación.</li>
        <li>Envío de pedidos.</li>
        <li>Derecho de desistimiento.</li>
        <li>Reclamaciones.</li>
        <li>Fuerza mayor.</li>
        <li>Competencia.</li>
        <li>Generalidades de la oferta.</li>
        <li>Precio y plazo de validez de la oferta.</li>
        <li>Gastos de transporte.</li>
        <li>Forma de pago, gastos y descuentos.</li>
        <li>Proceso de compra.</li>
        <li>Garantías aplicables.</li>
        <li>Garantías y devoluciones.</li>
        <li>Ley aplicable y jurisdicción.</li>
      </ol>

      <h2>1. Cláusulas generales de contratación</h2>
      <p>
        Salvo estipulación particular por escrito, la realización de un pedido al PRESTADOR
        supondrá la aceptación por parte del USUARIO de estas condiciones legales. Ninguna
        estipulación hecha por el USUARIO podrá diferir de las del PRESTADOR si no ha sido
        expresamente aceptada por adelantado y por escrito por el PRESTADOR.
      </p>

      <h2>2. Envío de pedidos</h2>
      <p>
        El PRESTADOR no enviará ningún pedido o activará ningún servicio hasta que haya
        comprobado que se ha realizado el pago.
      </p>
      <p>
        Los envíos de mercancías se harán habitualmente mediante mensajería según el destino
        designado libremente por el USUARIO.
      </p>
      <h3>Falta de ejecución del contrato a distancia</h3>
      <p>
        Las fechas o plazos de entrega se entenderán aproximadas, no constituyendo el retraso
        incumplimiento esencial. En caso de que el PRESTADOR no hubiera realizado la entrega de
        la mercancía, transcurridos 30 días desde la fecha de entrega pactada, por falta de
        disponibilidad del producto o servicio, el USUARIO deberá ser informado y quedará
        legitimado para cancelar el pedido y recibir la devolución del importe total pagado sin
        ningún coste, y sin que por ello se derive ninguna responsabilidad por daños y perjuicios
        imputable al PRESTADOR.
      </p>
      <p>
        En caso de retraso injustificado por parte del PRESTADOR respecto a la devolución del
        importe total, el USUARIO podrá reclamar que se le pague el doble del importe adeudado,
        sin perjuicio a su derecho de ser indemnizado por los daños y perjuicios sufridos en lo
        que excedan de dicha cantidad.
      </p>
      <p>
        El plazo de entrega suele estar comprendido entre 3 y 5 días laborables, según la
        población de destino y la forma de pago elegida. Se entiende este término siempre que se
        haya confirmado la disponibilidad de la mercancía y comprobado el pago completo del
        pedido.
      </p>
      <p>
        El PRESTADOR no asumirá ninguna responsabilidad cuando la entrega del producto o servicio
        no llegue a realizarse, por ser los datos facilitados por el USUARIO, falsos, inexactos o
        incompletos.
      </p>
      <p>
        La entrega se considerará realizada en el momento en que el transportista haya puesto los
        productos a disposición del USUARIO y este, o el delegado de este, haya firmado el
        documento de recepción de la entrega.
      </p>
      <p>
        Corresponde al USUARIO verificar los productos a la recepción y exponer todas las
        salvedades y reclamaciones que puedan estar justificadas en el documento de recepción de
        la entrega.
      </p>
      <p>
        En caso de que la contratación no conlleve la entrega física de ningún producto, sino una
        activación de unos servicios, siendo estos directamente descargados del sitio web, el
        PRESTADOR informará previamente al USUARIO respecto al procedimiento que debe seguir para
        realizar esta descarga.
      </p>

      <h2>3. Derecho de desistimiento</h2>
      <p>
        El USUARIO tiene los mismos derechos y plazos para proceder a realizar la devolución y/o
        reclamar los posibles vicios o defectos que presente el producto o servicio, tanto en
        modo en línea, como fuera de línea.
      </p>
      <p>
        El USUARIO dispone de un plazo de catorce días naturales, contados a partir de la fecha
        de recepción del producto, para la devolución del mismo (artículo 71 de la Ley 3/2014,
        de 27 de marzo). Salvo que la devolución se realice por defectos en el producto, los
        gastos relativos al envío serán asumidos por parte del USUARIO. El producto deberá
        devolverse en su embalaje original y en perfecto estado y, en caso de prestación de un
        servicio, desde el mismo día de activación y/o descarga del mismo.
      </p>
      <p>El derecho de desistimiento no podrá aplicarse en los siguientes casos:</p>
      <ol>
        <li>Si el producto no se presenta en perfectas condiciones.</li>
        <li>
          Si los embalajes del producto no son los originales o estos no se encuentran en
          perfecto estado. El embalaje original deberá proteger el producto de manera que se
          reciba en perfectas condiciones, quedando prohibido el uso de precintos y cintas
          adhesivas aplicados directamente sobre el mismo.
        </li>
        <li>Cuando el producto esté abierto sin poderse demostrar que no se haya usado.</li>
        <li>
          En las aplicaciones de software que sean directamente descargadas a través del portal
          o desprecintadas por el USUARIO tras su entrega física.
        </li>
        <li>
          Cuando sean productos personalizados o aquellos que, por razones de higiene u otras
          excepciones legalmente previstas en el artículo 103 de la Ley 3/2014, de 27 de marzo.
        </li>
        <li>
          En el suministro de productos cuyo precio depende de fluctuaciones del mercado
          financiero que el PRESTADOR no pueda controlar y que puedan producirse durante el
          período de desistimiento.
        </li>
        <li>
          En el suministro de productos confeccionados conforme a las especificaciones del
          USUARIO o claramente personalizados.
        </li>
        <li>
          En el suministro de productos que puedan deteriorarse o caducar con rapidez. Toda
          devolución deberá comunicarse al PRESTADOR, solicitando un número de devolución
          mediante el formulario habilitado para ello, o por correo electrónico a
          tiendaonline@saneamientos-pereda.com, indicando el número de factura o pedido
          correspondiente.
        </li>
      </ol>
      <p>
        Una vez el USUARIO haya recibido el número de devolución, hará llegar el producto al
        PRESTADOR, indicando este número en la carta de envío, con los gastos de transporte a su
        cargo, en el domicilio de SANEAMIENTOS PEREDA SA, CALLE INDEPENDENCIA, 43 – BAJO 33004
        OVIEDO (Asturias).
      </p>

      <h2>4. Reclamaciones</h2>
      <p>
        Cualquier reclamación que el USUARIO considere oportuna será atendida en la menor
        brevedad posible, pudiéndose realizar en las siguientes direcciones de contacto:
      </p>
      <p>
        Postal: SANEAMIENTOS PEREDA SA, CALLE INDEPENDENCIA, 43 – BAJO 33004 OVIEDO (Asturias)
        <br />
        Teléfono: 985271026
        <br />
        Mail: tiendaonline@saneamientos-pereda.com
      </p>
      <h3>Resolución de litigios en línea (Online Dispute Resolution)</h3>
      <p>
        Conforme al Art. 14.1 del Reglamento (UE) 524/2013, la Comisión Europea facilita una
        plataforma de acceso gratuito para la resolución de conflictos online entre el USUARIO y
        el PRESTADOR, sin necesidad de recurrir a los tribunales de justicia, mediante la
        intervención de un tercero, llamado Organismo de resolución de litigios, que actúa de
        intermediario entre ambos. Este organismo es neutral y dialogará con ambas partes para
        lograr un acuerdo, pudiendo finalmente sugerir y/o imponer una solución al conflicto.
      </p>
      <p>Enlace a la plataforma ODR: http://ec.europa.eu/consumers/odr/</p>

      <h2>5. Fuerza mayor</h2>
      <p>
        Las partes no incurrirán en responsabilidad ante cualquier falta debida a causa mayor.
        El cumplimiento de la obligación se demorará hasta el cese del caso de fuerza mayor.
      </p>

      <h2>6. Competencia</h2>
      <p>
        El USUARIO no podrá ceder, transferir o transmitir los derechos, responsabilidades y
        obligaciones contratados en la venta.
      </p>
      <p>
        Si alguna estipulación de estas condiciones fuera considerada nula o de imposible
        cumplimiento, la validez, legalidad y cumplimiento del resto no se verán afectados de
        ninguna manera, ni sufrirán modificación de ningún modo.
      </p>
      <p>
        El USUARIO declara haber leído, conocer y aceptar las presentes Condiciones en toda su
        extensión.
      </p>

      <h2>7. Generalidades de la oferta</h2>
      <p>
        Todas las ventas y entregas efectuadas por el PRESTADOR se entenderán sometidas a las
        presentes Condiciones.
      </p>
      <p>
        Ninguna modificación, alteración o pacto contrario a la Propuesta Comercial de
        SANEAMIENTOS PEREDA SA o a lo aquí estipulado, tendrá efecto, salvo pacto expreso por
        escrito firmado por el PRESTADOR, en este caso, estos pactos particulares prevalecerán.
      </p>
      <p>
        Dados los continuos avances técnicos y mejoras de los productos, el PRESTADOR se reserva
        la facultad de modificar sus especificaciones respecto de la información facilitada en
        su publicidad, hasta que no afecte el valor de los productos ofrecidos. Estas
        modificaciones tendrán asimismo validez en caso de que, por cualquier causa, se viera
        afectada la posibilidad de suministro de los productos ofrecidos.
      </p>

      <h2>8. Precio y plazo de validez de la oferta</h2>
      <p>
        Los precios que se indican respecto de cada producto incluyen el Impuesto sobre el Valor
        Añadido (IVA) u otros impuestos que pudieran ser aplicables. Estos precios, a menos que
        se indique expresamente lo contrario, no incluyen los gastos de envío, manipulación,
        envoltorio, seguro de envíos o cualesquiera otros servicios adicionales y anexos al
        producto o servicio adquirido.
      </p>
      <p>
        Los precios aplicables a cada producto son los publicados en el sitio web y se
        expresarán en la moneda EURO. El USUARIO asume que la valoración económica de algunos de
        los productos podrá variar en tiempo real.
      </p>
      <p>
        Antes de realizar la compra podrá comprobar en línea todos los detalles del presupuesto:
        artículos, cantidades, precio, disponibilidad, gastos de transporte, cargos, descuentos,
        impuestos y el total de la compra. Los precios pueden cambiar diariamente mientras no se
        realice el pedido.
      </p>
      <p>
        Una vez realizado el pedido, los precios se mantendrán tanto si hay disponibilidad de
        productos como si no.
      </p>
      <p>
        Todo pago realizado al PRESTADOR conlleva la emisión de una factura a nombre del USUARIO
        registrado o de la razón social que este haya informado en el momento de realizar el
        pedido. Esta factura se enviará junto con el producto adquirido. Para cualquier
        información sobre el pedido, el USUARIO podrá contactar a través del teléfono de atención
        al cliente del PRESTADOR 985271026 o vía correo electrónico a la dirección
        tiendaonline@saneamientos-pereda.com.
      </p>

      <h2>9. Gastos de transporte</h2>
      <p>
        Los precios no incluyen gastos de envío o comunicación, ni de instalación o descarga, o
        prestaciones complementarias, salvo pacto expreso por escrito en contrario. Los portes se
        calcularán en el momento de guardar la cesta o presupuesto, ya que se calculan por el
        peso y dimensión de los productos y por la dirección de entrega.
      </p>

      <h2>10. Formas de pago, cargos y descuentos</h2>
      <p>El PRESTADOR posibilita las siguientes formas para efectuar el pago de un pedido:</p>
      <ul>
        <li>Tarjeta de crédito: no se aplicarán ni descuentos ni cargos.</li>
      </ul>
      <h3>Medidas de seguridad</h3>
      <p>
        El sitio web utiliza técnicas de seguridad de la información generalmente aceptadas en la
        industria, tales como firewalls, procedimientos de control de acceso y mecanismos
        criptográficos, todo ello con el objeto de evitar el acceso no autorizado a los datos.
        Para lograr estos fines, el usuario/cliente acepta que el prestador obtenga datos para
        efecto de la correspondiente autenticación de los controles de acceso.
      </p>
      <p>
        El PRESTADOR se compromete a no permitir ninguna transacción que sea o sea considerada
        ilegal por las marcas de tarjetas de crédito o el banco adquiriente, que pueda o tenga el
        potencial de dañar la buena voluntad de los mismos o influir de manera negativa en ellos.
      </p>
      <p>
        Las siguientes actividades están prohibidas en virtud de los programas de las marcas de
        tarjetas: la venta u oferta de un producto o servicio que no cumpla con todas las leyes
        aplicables al Comprador, Banco Emisor, Comerciante o Titular de la tarjeta o tarjetas.
      </p>

      <h2>11. Proceso de compra</h2>
      <h3>Cesta (simulación de presupuesto)</h3>
      <p>
        Cualquier producto de nuestro catálogo, que esté disponible para la venta online, se
        puede añadir a la cesta. En esta, solo se observarán los artículos, la cantidad, el
        precio y el importe total. Una vez guardada la cesta se procederá a calcular los
        impuestos, cargos y descuentos según los datos de pago y de envío introducidos.
      </p>
      <p>
        Las cestas no tienen ninguna vinculación administrativa, solo es un apartado donde se
        puede simular un presupuesto sin ningún compromiso por ambas partes.
      </p>
      <p>
        Desde la cesta se puede hacer un pedido siguiendo los pasos siguientes para su correcta
        formalización:
      </p>
      <ol>
        <li>Comprobación de los datos de facturación.</li>
        <li>Comprobación de la dirección de envío.</li>
        <li>Selección de la forma de pago.</li>
        <li>Realizar el pedido (comprar).</li>
      </ol>
      <p>
        Una vez procesado el pedido, el sistema envía instantáneamente un correo electrónico al
        departamento de gestión del PRESTADOR y otro al correo del USUARIO confirmando la
        realización del pedido.
      </p>
      <h3>Pedidos (solicitudes de compra)</h3>
      <p>
        En un máximo de 48 horas, en días laborables, se enviará un correo electrónico al USUARIO
        confirmando el estado del pedido y la fecha de envío y/o entrega aproximada.
      </p>

      <h2>12. Garantías aplicables</h2>
      <p>
        Todos los productos ofrecidos a través del sitio web son completamente originales, salvo
        que se indique lo contrario en su descripción. Todos tienen un período de garantía de dos
        años, conforme a los criterios y condiciones descritos en el Real Decreto Legislativo
        1/2007, de 16 de noviembre, por el que se aprueba el texto refundido de la Ley General
        para la Defensa de los consumidores y usuarios y otras leyes complementarias.
      </p>

      <h2>13. Garantías y devoluciones</h2>
      <p>
        La garantía de los productos ofrecidos responderá a los siguientes artículos basados en
        el Real Decreto Legislativo 1/2007, de 16 de noviembre, por el que se aprueba el texto
        refundido de la Ley General para la Defensa de los Consumidores y Usuarios y otras leyes
        complementarias:
      </p>
      <h3>Artículo 114. Principios generales.</h3>
      <p>
        El vendedor está obligado a entregar al consumidor y usuario productos que sean conformes
        con el contrato, respondiendo frente a él de cualquier falta de conformidad que exista
        en el momento de la entrega del producto.
      </p>
      <h3>Artículo 115. Ámbito de aplicación.</h3>
      <p>
        1. Están incluidos en el ámbito de aplicación de este título los contratos de compraventa
        de productos y los contratos de suministro de productos que hayan de producirse o
        fabricarse.
      </p>
      <p>
        2. Lo previsto en este título no será de aplicación a los productos adquiridos mediante
        venta judicial, al agua o al gas, cuando no estén envasados para la venta en volumen
        delimitado o cantidades determinadas, y a la electricidad.
      </p>
      <p>
        Tampoco será aplicable a los productos de segunda mano adquiridos en subasta
        administrativa a la que los consumidores y usuarios puedan asistir personalmente.
      </p>
      <h3>Artículo 116. Conformidad de los productos con el contrato.</h3>
      <p>
        1. Salvo prueba en contrario, se entenderá que los productos son conformes con el
        contrato siempre que cumplan todos los requisitos que se expresan a continuación, salvo
        que por las circunstancias del caso alguno de ellos no resulte aplicable:
      </p>
      <p>
        a) Se ajusten a la descripción realizada por el vendedor y posean las cualidades del
        producto que el vendedor haya presentado al consumidor y usuario en forma de muestra o
        modelo.
        <br />
        b) Sean aptos para los usos a que ordinariamente se destinen los productos del mismo
        tipo.
        <br />
        c) Sean aptos para cualquier uso especial requerido por el consumidor y usuario cuando lo
        haya puesto en conocimiento del vendedor en el momento de celebración del contrato,
        siempre que éste haya admitido que el producto es apto para dicho uso.
        <br />
        d) Presenten la calidad y prestaciones habituales de un producto del mismo tipo que el
        consumidor y usuario pueda fundadamente esperar, habida cuenta de la naturaleza del
        producto y, en su caso, de las declaraciones públicas sobre las características concretas
        de los productos hechas por el vendedor, el productor o su representante, en particular
        en la publicidad o en el etiquetado. El vendedor no quedará obligado por tales
        declaraciones públicas si demuestra que desconocía y no cabía razonablemente esperar que
        conociera la declaración en cuestión, que dicha declaración había sido corregida en el
        momento de celebración del contrato o que dicha declaración no pudo influir en la
        decisión de comprar el producto.
      </p>
      <p>
        2. La falta de conformidad que resulte de una incorrecta instalación del producto se
        equiparará a la falta de conformidad del producto cuando la instalación esté incluida en
        el contrato de compraventa o suministro regulados en el artículo 115.1 y haya sido
        realizada por el vendedor o bajo su responsabilidad, o por el consumidor y usuario cuando
        la instalación defectuosa se deba a un error en las instrucciones de instalación.
      </p>
      <p>
        3. No habrá lugar a responsabilidad por faltas de conformidad que el consumidor y usuario
        conociera o no hubiera podido fundadamente ignorar en el momento de la celebración del
        contrato o que tengan su origen en materiales suministrados por el consumidor y usuario.
      </p>
      <h3>Artículo 117. Incompatibilidad de acciones.</h3>
      <p>
        El ejercicio de las acciones que contempla este título será incompatible con el ejercicio
        de las acciones derivadas del saneamiento por vicios ocultos de la compraventa. En todo
        caso, el consumidor y usuario tendrá derecho, de acuerdo con la legislación civil y
        mercantil, a ser indemnizado por los daños y perjuicios derivados de la falta de
        conformidad.
      </p>
      <h3>Artículo 118. Responsabilidad del vendedor y derechos del consumidor y usuario.</h3>
      <p>
        El consumidor y usuario tiene derecho a la reparación del producto, a su sustitución, a
        la rebaja del precio o a la resolución del contrato, de acuerdo con lo previsto en este
        título.
      </p>
      <h3>Artículo 119. Reparación y sustitución del producto.</h3>
      <p>
        1. Si el producto no fuera conforme con el contrato, el consumidor y usuario podrá optar
        entre exigir la reparación o la sustitución del producto, salvo que una de estas dos
        opciones resulte objetivamente imposible o desproporcionada. Desde el momento en que el
        consumidor y usuario comunique al vendedor la opción elegida, ambas partes habrán de
        atenerse a ella. Esta decisión del consumidor y usuario se entiende sin perjuicio de lo
        dispuesto en el artículo siguiente para los supuestos en que la reparación o la
        sustitución no logren poner el producto en conformidad con el contrato.
      </p>
      <p>
        2. Se considerará desproporcionada la forma de saneamiento que en comparación con la
        otra, imponga al vendedor costes que no sean razonables, teniendo en cuenta el valor que
        tendría el producto si no hubiera falta de conformidad, la relevancia de la falta de
        conformidad y si la forma de saneamiento alternativa se pudiese realizar sin
        inconvenientes mayores para el consumidor y usuario. Para determinar si los costes no son
        razonables, los gastos correspondientes a una forma de saneamiento deben ser, además,
        considerablemente más elevados que los gastos correspondientes a la otra forma de
        saneamiento.
      </p>
      <h3>Artículo 120. Régimen jurídico de la reparación o sustitución del producto.</h3>
      <p>La reparación y la sustitución se ajustarán a las siguientes reglas:</p>
      <p>
        a) Serán gratuitas para el consumidor y usuario. Dicha gratuidad comprenderá los gastos
        necesarios realizados para subsanar la falta de conformidad de los productos con el
        contrato, especialmente los gastos de envío, así como los costes relacionados con la
        mano de obra y los materiales.
        <br />
        b) Deberán llevarse a cabo en un plazo razonable y sin mayores inconvenientes para el
        consumidor y usuario, habida cuenta de la naturaleza de los productos y de la finalidad
        que tuvieran para el consumidor y usuario.
        <br />
        c) La reparación suspende el cómputo de los plazos a que se refiere el artículo 123. El
        período de suspensión comenzará desde que el consumidor y usuario ponga el producto a
        disposición del vendedor y concluirá con la entrega al consumidor y usuario del producto
        ya reparado. Durante los seis meses posteriores a la entrega del producto reparado, el
        vendedor responderá de las faltas de conformidad que motivaron la reparación,
        presumiéndose que se trata de la misma falta de conformidad cuando se reproduzcan en el
        producto defectos del mismo origen que los inicialmente manifestados.
        <br />
        d) Si concluida la reparación y entregado el producto, éste sigue siendo no conforme con
        el contrato, el consumidor y usuario podrá exigir la sustitución del producto, salvo que
        esta opción resulte desproporcionada, la rebaja del precio o la resolución del contrato
        en los términos previstos en este capítulo.
        <br />
        e) La sustitución suspende los plazos a que se refiere el artículo 123 desde el ejercicio
        de la opción por el consumidor y usuario hasta la entrega del nuevo producto. Al producto
        sustituto le será de aplicación, en todo caso, el artículo 123.1, párrafo segundo.
        <br />
        f) Si la sustitución no lograra poner el producto en conformidad con el contrato, el
        consumidor y usuario podrá exigir la reparación del producto, salvo que esta opción
        resulte desproporcionada, la rebaja del precio o la resolución del contrato en los
        términos previstos en este capítulo.
        <br />
        g) El consumidor y usuario no podrá exigir la sustitución en el caso de productos no
        fungibles, ni tampoco cuando se trate de productos de segunda mano.
      </p>
      <h3>Artículo 121. Rebaja del precio y resolución del contrato.</h3>
      <p>
        La rebaja del precio y la resolución del contrato procederán, a elección del consumidor
        y usuario, cuando éste no pudiera exigir la reparación o la sustitución y en los casos
        en que éstas no se hubieran llevado a cabo en plazo razonable o sin mayores
        inconvenientes para el consumidor y usuario. La resolución no procederá cuando la falta
        de conformidad sea de escasa importancia.
      </p>
      <h3>Artículo 122. Criterios para la rebaja del precio.</h3>
      <p>
        La rebaja del precio será proporcional a la diferencia existente entre el valor que el
        producto hubiera tenido en el momento de la entrega de haber sido conforme con el
        contrato y el valor que el producto efectivamente entregado tenía en el momento de dicha
        entrega.
      </p>
      <h3>Artículo 123. Plazos.</h3>
      <p>
        1. El vendedor responde de las faltas de conformidad que se manifiesten en un plazo de
        dos años desde la entrega. En los productos de segunda mano, el vendedor y el consumidor
        y usuario podrán pactar un plazo menor, que no podrá ser inferior a un año desde la
        entrega. Salvo prueba en contrario, se presumirá que las faltas de conformidad que se
        manifiesten en los seis meses posteriores a la entrega del producto, sea éste nuevo o de
        segunda mano, ya existían cuando la cosa se entregó, excepto cuando esta presunción sea
        incompatible con la naturaleza del producto o la índole de la falta de conformidad.
      </p>
      <p>
        2. Salvo prueba en contrario, la entrega se entiende hecha en el día que figure en la
        factura o tique de compra, o en el albarán de entrega correspondiente si éste fuera
        posterior.
      </p>
      <p>
        3. El vendedor está obligado a entregar al consumidor o usuario que ejercite su derecho
        a la reparación o sustitución, justificación documental de la entrega del producto, en
        la que conste la fecha de entrega y la falta de conformidad que origina el ejercicio
        del derecho. Del mismo modo, junto con el producto reparado o sustituido, el vendedor
        entregará al consumidor o usuario justificación documental de la entrega en la que
        conste la fecha de ésta y, en su caso, la reparación efectuada.
      </p>
      <p>
        4. La acción para reclamar el cumplimiento de lo previsto en el capítulo II de este
        título prescribirá a los tres años desde la entrega del producto.
      </p>
      <p>
        5. El consumidor y usuario deberá informar al vendedor de la falta de conformidad en el
        plazo de dos meses desde que tuvo conocimiento de ella. El incumplimiento de dicho plazo
        no supondrá la pérdida del derecho al saneamiento que corresponda, siendo responsable
        el consumidor y usuario, no obstante, de los daños o perjuicios efectivamente
        ocasionados por el retraso en la comunicación. Salvo prueba en contrario, se entenderá
        que la comunicación del consumidor y usuario ha tenido lugar dentro del plazo
        establecido.
      </p>
      <h3>Artículo 124. Acción contra el productor.</h3>
      <p>
        Cuando al consumidor y usuario le resulte imposible o le suponga una carga excesiva
        dirigirse frente al vendedor por la falta de conformidad de los productos con el
        contrato podrá reclamar directamente al productor con el fin de obtener la sustitución
        o reparación del producto.
      </p>
      <p>
        Con carácter general, y sin perjuicio de que la responsabilidad del productor cesara, a
        los efectos de este título, en los mismos plazos y condiciones que los establecidos para
        el vendedor, el productor responderá por la falta de conformidad cuando ésta se refiera
        al origen, identidad o idoneidad de los productos, de acuerdo con su naturaleza y
        finalidad y con las normas que los regulan. Quien haya respondido frente al consumidor
        y usuario dispondrá del plazo de un año para repetir frente al responsable de la falta
        de conformidad. Dicho plazo se computa a partir del momento en que se completó el
        saneamiento.
      </p>

      <h2>14. Ley aplicable y jurisdicción</h2>
      <p>
        Estas condiciones se regirán o interpretarán conforme a la legislación española en
        aquello que no esté expresamente establecido.
      </p>
      <p>
        El PRESTADOR y el USUARIO acuerdan someter a los juzgados y tribunales del domicilio del
        USUARIO cualquier controversia que pudiera suscitarse de la prestación de los productos
        o servicios objeto de estas Condiciones.
      </p>
    </LegalPage>
  );
}
