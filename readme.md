# LinguiJS M50

## Introduction

Configurar LinguiJS en un proyecto Next.js para cargar los archivos de traducción de manera remota es una excelente manera de optimizar la gestión de idiomas en tu aplicación. A continuación, explicaremos paso a paso sobre cómo hacerlo:

## Instalar las Dependencias Necesarias

Primero, necesitas instalar las dependencias de LinguiJS y su integración con React:

```bash
npm install @lingui/react @lingui/core @lingui/cli @lingui/macro
```

## Configurar LinguiJS

Crea un archivo de configuración para LinguiJS llamado `lingui.config.js` en la raíz de tu proyecto:

```javascript
export default {
   locales: ['en', 'es', 'fr'], // Idiomas soportados
   sourceLocale: 'en', // Idioma base
   fallbackLocales: { default: 'en' }, // Idioma fallback
   catalogs: [
      {
         path: "<rootDir>/locales/{locale}",
         include: ["<rootDir>/src"],
      },
   ],
   format: 'po', // Puedes usar `json`, `po`, `minimal` según tu preferencia
}
```

## Prepara los Archivos de Traducción

LinguiJS utiliza archivos `.po` o `.json` para las traducciones. Genera las plantillas de traducción con el siguiente comando:

```bash
npm run lingui extract
```

Esto generará los archivos `.po` en la carpeta especificada en el catálogo.

## Cargar Traducciones de Manera Remota

Para cargar las traducciones de manera remota, necesitarás ajustar la configuración de i18n en tu proyecto Next.js y LinguiJS. Aquí te explico cómo hacerlo:

### Crear un Loader de Traducciones Personalizado

Crea un archivo `src/utils/remoteLoader.js` para manejar la carga remota de las traducciones:

```javascript
import { i18n } from '@lingui/core';

export async function loadMessages(locale) {
   const messages = await fetch(`https://cdn.example.com/locales/${locale}/messages.json`)
      .then((response) => response.json());

   i18n.load(locale, messages);
   i18n.activate(locale);
}
```

### Configurar el App de Next.js para Usar Lingui

En `pages/_app.js`, carga las traducciones utilizando el loader personalizado:

```javascript
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
import { loadMessages } from '../src/utils/remoteLoader';

function MyApp({ Component, pageProps }) {
   const { locale } = pageProps;

   useEffect(() => {
      loadMessages(locale);
   }, [locale]);
   
   return (
      <I18nProvider i18n={i18n}>
      <Component {...pageProps} />
      </I18nProvider>
   );
}

MyApp.getInitialProps = async ({ ctx }) => {
   const locale = ctx.query.locale || 'en';
   return { pageProps: { locale } };
};

export default MyApp;
```

### Ajuste en las Páginas para Cargar el Idioma Correcto

Asegúrate de que tus páginas carguen el idioma correcto cuando se inicialicen:

```javascript
import { Trans } from '@lingui/macro';

export default function Home() {
   return (
      <div>
      <h1><Trans>Hello World</Trans></h1>
      </div>
   );
}
```

### Asegurar la Carga de los Archivos en el Servidor (Opcional)

Si estás utilizando Server-Side Rendering (SSR) con Next.js, puedes asegurar que las traducciones se carguen en el servidor antes de renderizar la página:

```javascript
MyApp.getInitialProps = async ({ ctx }) => {
   const locale = ctx.query.locale || 'en';
   await loadMessages(locale);
   return { pageProps: { locale } };
};
```

### Despliegue y CDN

- CDN: Asegúrate de que los archivos JSON de traducción estén disponibles en la CDN con la estructura correcta. Esto podría implicar un proceso de despliegue que suba los archivos de traducción a la CDN después de cada actualización.
- Cacheo: Configura el cacheo en la CDN para que los archivos de traducción se almacenen en el navegador, mejorando así el rendimiento en visitas repetidas.
