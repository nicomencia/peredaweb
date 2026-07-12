import './SimplePage.css';

// Client-legal-provided GDPR consent clauses, rendered as a compact scrollable
// box above an ACEPTAR checkbox. Texts are verbatim from the legal documents —
// do not reword without legal sign-off.

// "Consentimiento para el tratamiento de datos" — for forms collecting
// personal data (Hazte cliente, Presupuesto).
export function DataConsentClause() {
  return (
    <div className="consent-clause">
      <p className="consent-clause-title">
        Consentimiento para el tratamiento de datos personales
      </p>
      <div className="consent-clause-body">
        <p>
          <strong>SANEAMIENTOS PEREDA SA</strong> es el Responsable del tratamiento de los datos
          personales del Usuario y le informa de que estos datos se tratarán de conformidad con lo
          dispuesto en el Reglamento (UE) 2016/679, de 27 de abril (RGPD), y la Ley Orgánica
          3/2018, de 5 de diciembre (LOPDGDD), por lo que se le facilita la siguiente información
          del tratamiento:
        </p>
        <p>
          <strong>Fines y legitimación del tratamiento:</strong> mantener una relación comercial
          (por interés legítimo del responsable, art. 6.1.f RGPD) y envío de comunicaciones de
          productos o servicios (con el consentimiento del interesado, art. 6.1.a RGPD).
        </p>
        <p>
          <strong>Criterios de conservación de los datos:</strong> se conservarán durante no más
          tiempo del necesario para mantener el fin del tratamiento o existan prescripciones
          legales que dictaminen su custodia y cuando ya no sea necesario para ello, se suprimirán
          con medidas de seguridad adecuadas para garantizar la anonimización de los datos o la
          destrucción total de los mismos.
        </p>
        <p>
          <strong>Comunicación de los datos:</strong> no se comunicarán los datos a terceros,
          salvo obligación legal.
        </p>
        <p>
          <strong>Derechos que asisten al Usuario:</strong> derecho a retirar el consentimiento en
          cualquier momento; derecho de acceso, rectificación, portabilidad y supresión de sus
          datos, y de limitación u oposición a su tratamiento; derecho a presentar una reclamación
          ante la Autoridad de control (www.aepd.es) si considera que el tratamiento no se ajusta
          a la normativa vigente.
        </p>
        <p>
          <strong>Datos de contacto para ejercer sus derechos:</strong> SANEAMIENTOS PEREDA SA.
          CALLE INDEPENDENCIA, 43 BAJO - 33004 OVIEDO (Asturias). E-mail:
          alberto@saneamientos-pereda.com
        </p>
      </div>
    </div>
  );
}

// "Consentimiento para el envío de CURRÍCULUM" — for the careers/CV form.
export function CvConsentClause() {
  return (
    <div className="consent-clause">
      <p className="consent-clause-title">
        Información para el tratamiento de datos personales con finalidad de candidato a empleado
      </p>
      <div className="consent-clause-body">
        <p>
          <strong>SANEAMIENTOS PEREDA SA</strong> es el Responsable del tratamiento de los datos
          personales del interesado y le informa de que estos datos se tratarán de conformidad con
          lo dispuesto en el Reglamento (UE) 2016/679, de 27 de abril (RGPD), y la Ley Orgánica
          3/2018, de 5 de diciembre (LOPDGDD), por interés legítimo del Responsable, facilitándole
          la siguiente información del tratamiento:
        </p>
        <p>
          <strong>Fines del tratamiento:</strong> hacer partícipe al interesado en los procesos de
          selección de personal, llevando a cabo un análisis del perfil del solicitante con el
          objetivo de seleccionar al mejor candidato para el puesto vacante del Responsable.
        </p>
        <p>
          <strong>Legitimación del tratamiento:</strong> consentimiento inequívoco mediante una
          clara acción del interesado (RGPD, art. 6.1.a).
        </p>
        <p>
          <strong>Registro de currículums:</strong> le informamos de que este es el único
          procedimiento oficial para aceptar su currículum, por lo que no se aceptarán los
          currículums remitidos por otro procedimiento diferente.
        </p>
        <p>
          <strong>Criterios de conservación de los datos:</strong> se conservarán durante un plazo
          máximo de un año, transcurrido el cual se procederá a la supresión de los datos
          garantizándole un total respeto a la confidencialidad, tanto en el tratamiento como en
          su posterior destrucción. En este sentido, transcurrido el citado plazo, y si desea
          continuar participando en los procesos de selección del Responsable, le rogamos nos
          remita nuevamente su currículum.
        </p>
        <p>
          <strong>Actualización de los datos:</strong> en caso de producirse alguna modificación
          en sus datos, le rogamos nos lo comunique por escrito lo antes posible, con objeto de
          mantener sus datos debidamente actualizados.
        </p>
        <p>
          <strong>Comunicación de los datos:</strong> se podrán tratar y/o comunicar a las
          empresas integrantes de nuestro grupo (cuyas direcciones figuran en esta misma página
          web), durante el tiempo de conservación de su currículum y para los mismos fines antes
          informados.
        </p>
        <p>
          <strong>Derechos que asisten al Interesado:</strong> derecho a retirar el consentimiento
          en cualquier momento; derecho de acceso, rectificación, portabilidad y supresión de sus
          datos y de limitación u oposición a su tratamiento; derecho a presentar una reclamación
          ante la Autoridad de control (www.aepd.es) si considera que el tratamiento no se ajusta
          a la normativa vigente.
        </p>
        <p>
          <strong>Datos de contacto para ejercer sus derechos:</strong> SANEAMIENTOS PEREDA SA.
          CALLE INDEPENDENCIA, 43 BAJO - 33004 OVIEDO (Asturias). E-mail:
          alberto@saneamientos-pereda.com
        </p>
      </div>
    </div>
  );
}
