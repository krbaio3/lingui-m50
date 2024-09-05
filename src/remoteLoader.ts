import { I18n, i18n } from '@lingui/core';
import { Locales }    from '../types/types';

export async function loadMessages(locale: keyof Locales): Promise<I18n> {
    const messages = await fetch(`https://cdn.example.com/locales/${locale.toString()}/messages.json`)
        .then((response) => response.json());

    i18n.load(locale.toString(), messages);
    i18n.activate(locale.toString());

    return i18n;
}