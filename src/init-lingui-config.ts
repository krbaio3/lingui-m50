import { LinguiConfig }    from '@lingui/conf';

const initLinguiConfig = (config: LinguiConfig): LinguiConfig => {
    const rootDir = config.rootDir || __dirname;
    const catalogs = config.catalogs || [
        {
            path: `${ rootDir }/locales/{locale}`,
            include: [ `${ rootDir }/src` ],
        },
    ];
    return {
        locales: [ 'en', 'es', 'pt' ], // Idiomas soportados
        sourceLocale: 'es', // Idioma base
        fallbackLocales: { default: 'es' }, // Idioma fallback
        rootDir,
        catalogs,
        format: config.format || 'po', // Puedes usar `json`, `po`, `minimal` según tu preferencia
    }
};

export default initLinguiConfig;