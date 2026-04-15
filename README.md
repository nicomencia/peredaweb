# PEREDAWEB

## Demo
- [demo](https://nicomencia-peredaweb-bb02.bolt.host)
- [qr](https://quickchart.io/qr?size=300&text=https://nicomencia-peredaweb-bb02.bolt.host)

## Arquitectura del proyecto

### Diagrama de arquitectura

```mermaid
flowchart LR
    User[Usuario<br/>Navegador web]

    subgraph Code[Web / Código]
        subgraph Frontend
            Web[Web App<br/>React SPA]
            CSS[CSS<br/>Estilos personalizados]
        end

        subgraph Tooling
            Vite[Vite<br/>Dev Server & Build]
        end
    end

    subgraph Backend
        Supabase[Supabase<br/>Base de datos y storage]
    end

    subgraph Infraestructura
        Bolt[Bolt Hosting<br/>Web desplegada]
        GitHub[GitHub<br/>Repositorio de código]
    end

    User --> Web
    Web --> CSS
    Web --> Supabase

    Vite --> Web

    Bolt --> Web

    GitHub <--> Bolt
```

### Frontend (lo que ve el usuario)

- **React**  
  Librería JavaScript para construir interfaces de usuario basadas en componentes.  
  En lugar de trabajar directamente sobre el DOM con HTML y JavaScript imperativo, React utiliza un modelo declarativo: la interfaz se describe como una función del estado, y React se encarga de actualizar solo las partes necesarias cuando los datos cambian.

  La aplicación se estructura en componentes reutilizables que encapsulan su propio marcado (JSX), lógica y estado, lo que facilita el mantenimiento, la escalabilidad y la reutilización de código.  
  Este enfoque permite una navegación fluida tipo *Single Page Application (SPA)*, evitando recargas completas de página y mejorando la experiencia de usuario.

- **Vite**  
  Herramienta moderna de desarrollo y build que actúa como servidor local y sistema de empaquetado.  
  Durante el desarrollo utiliza módulos ES nativos del navegador, lo que permite tiempos de arranque prácticamente instantáneos y recarga en caliente (*Hot Module Replacement*) muy rápida.

  Para producción, Vite se encarga de generar una versión optimizada de la aplicación:  
  - Minificación de código  
  - División en bundles eficientes  
  - Optimización de dependencias  

  Esto se traduce en tiempos de carga reducidos y un mejor rendimiento en producción, con una configuración mínima.

- **CSS personalizado**  
  El diseño visual de la web se define mediante CSS escrito a medida.  
  Esto permite un control total sobre el layout, la tipografía, los colores y las animaciones, sin depender de frameworks de estilos predefinidos.

  El CSS está pensado para ser responsive, asegurando una correcta visualización en distintos tamaños de pantalla (móvil, tablet y escritorio) y manteniendo una identidad visual coherente con la marca.

### Backend y datos

- **Supabase**
  - [UI](https://supabase.com/dashboard/project/hggbqyamebqyjvdfpwgu)
  -  Servicio en la nube que actúa como backend y base de datos para la aplicación.  
  - Proporciona almacenamiento seguro para productos, contenido e imágenes, con actualizaciones en tiempo real, copias de seguridad automáticas y control de acceso.  
  - No requiere servidores propios: todo se gestiona en la nube y escala según tus necesidades.

- **Bolt Hosting**  
  - Plataforma que aloja la web y sirve los archivos al usuario.  
  - Se encarga del despliegue, de mantener la web accesible y de gestionar actualizaciones desde el repositorio de código en GitHub.

### Sistema de administración
- [Ejemplo](https://flueu.com/)
- Panel de administración desarrollado también en **React**.
- Acceso protegido mediante autenticación.
- Interfaz sencilla para gestionar productos y contenido, con cambios reflejados casi al instante.
- Posibilidades a medida, ej. Excel que actualiza todos los productos

### Beneficios de este stack
- Alta velocidad y buena experiencia de usuario
- Arquitectura moderna y escalable
- Bajo mantenimiento técnico
- Seguridad y fiabilidad en los datos
- Coste reducido y eficiente

## Inspo de webs para utilizar
- https://www.roca.es/productos
- https://www.hansgrohe.es/

## Puntos a resolver
- Estilo general
- Funcionalidades particulares necesarias
- Cómo obtener las fotos
- Que se necesita que sea editable fácilmente
- Dónde está alojada la web actual

## 🗓️ Timeline

| Fecha      | Sesión               | Objetivo                                                               | Resultado                  |
|------------|----------------------|------------------------------------------------------------------------|----------------------------|
| 16/12/2025 | Toma de contacto     | Compartir primeras ideas de la web                                     | Primera versión como PoC   |
| 16/04/2026 | Primera revisión     | Definir páginas, estructura de las mismas y su contenido general       | Web con 90% de estructura estable  |
| 04/05/2026 | Segunda revisión     | Exponer el contenido que ha de ser editado y cómo                      | Web con funcionalidad de administración al 90%  |
| 25/05/2026 | Tercera revisión     | Revisión de los detalles, tanto de contenido como estéticos y de admin | Ajustes finales         |
| 15/06/2026 | Subida a PRO         | Últimos detalles sobre el despliegue y SEO                             | Web desplegada al público funcional |

