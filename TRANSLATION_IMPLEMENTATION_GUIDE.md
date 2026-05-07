# Translation Implementation Guide
## Next.js Internationalization with next-intl

This guide explains how to implement the same translation system used in this Abu Sara Jewelry project in another Next.js application.

### Overview
This project uses `next-intl` for internationalization with support for English (`en`) and Arabic (`ar`) languages.

---

## 1. Installation

Install the required packages:

```bash
npm install next-intl
```

---

## 2. Project Structure

Create the following directory structure:

```
your-project/
├── i18n/
│   ├── routing.ts
│   └── request.ts
├── messages/
│   ├── en/
│   │   ├── common.json
│   │   ├── navigation.json
│   │   ├── home.json
│   │   └── [other-pages].json
│   └── ar/
│       ├── common.json
│       ├── navigation.json
│       ├── home.json
│       └── [other-pages].json
├── app/
│   └── [locale]/
│       ├── layout.tsx
│       └── page.tsx
└── middleware.ts
```

---

## 3. Configuration Files

### i18n/routing.ts

```typescript
import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/about': '/about',
    '/contact': '/contact',
    // Add more routes as needed
  }
});

export const {Link, redirect, usePathname, useRouter, getPathname} = 
  createNavigation(routing);
```

### i18n/request.ts

```typescript
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}: {requestLocale: Promise<string | undefined>}) => {
  let locale = await requestLocale;
  
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  
  const [
    common,
    navigation, 
    home,
    about,
    contact,
    // Add more imports as needed
  ] = await Promise.all([
    import(`../messages/${locale}/common.json`),
    import(`../messages/${locale}/navigation.json`),
    import(`../messages/${locale}/home.json`),
    import(`../messages/${locale}/about.json`),
    import(`../messages/${locale}/contact.json`),
    // Add more imports as needed
  ]);

  return {
    locale,
    messages: {
      common: common.default,
      navigation: navigation.default,
      home: home.default,
      about: about.default,
      contact: contact.default,
      // Add more message namespaces as needed
    },
    timeZone: 'Asia/Amman' // Adjust timezone as needed
  };
});
```

---

## 4. Middleware Configuration

### middleware.ts

```typescript
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(ar|en)/:path*'];
};
```

---

## 5. App Router Setup

### app/[locale]/layout.tsx

```typescript
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

---

## 6. Translation Files Structure

### messages/en/common.json

```json
{
  "callUs": "Call Us",
  "visitUs": "Visit Us",
  "address": "Address",
  "phone": "Phone",
  "loading": "Loading...",
  "error": "Error",
  "success": "Success",
  "close": "Close",
  "cancel": "Cancel",
  "submit": "Submit",
  "category": {
    "all": "All",
    "rings": "Rings",
    "necklaces": "Necklaces",
    "bracelets": "Bracelets"
  }
}
```

### messages/ar/common.json

```json
{
  "callUs": "اتصل بنا",
  "visitUs": "زرنا",
  "address": "العنوان",
  "phone": "الهاتف",
  "loading": "جاري التحميل...",
  "error": "خطأ",
  "success": "نجح",
  "close": "إغلاق",
  "cancel": "إلغاء",
  "submit": "إرسال",
  "category": {
    "all": "الكل",
    "rings": "خواتم",
    "necklaces": "قلادات",
    "bracelets": "أساور"
  }
}
```

---

## 7. Using Translations in Components

### Basic Usage

```typescript
import {useTranslations} from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('common');
  
  return (
    <div>
      <button>{t('callUs')}</button>
      <span>{t('loading')}</span>
    </div>
  );
}
```

### Nested Keys

```typescript
import {useTranslations} from 'next-intl';

export default function CategoryComponent() {
  const t = useTranslations('common');
  
  return (
    <div>
      <span>{t('category.all')}</span>
      <span>{t('category.rings')}</span>
    </div>
  );
}
```

### Different Namespaces

```typescript
import {useTranslations} from 'next-intl';

export default function NavigationComponent() {
  const t = useTranslations('navigation');
  
  return (
    <nav>
      <a href="/about">{t('about')}</a>
      <a href="/contact">{t('contact')}</a>
    </nav>
  );
}
```

---

## 8. Navigation with Locale Support

```typescript
import {Link} from '@/i18n/routing';

export default function Navigation() {
  return (
    <nav>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
      <Link href="/ar/about" locale="ar">العربية</Link>
      <Link href="/en/about" locale="en">English</Link>
    </nav>
  );
}
```

---

## 9. Language Switcher Component

```typescript
import {useLocale} from 'next-intl';
import {useRouter, usePathname} from 'next/navigation';
import {ChangeEventHandler, useTransition} from 'react';

export default function LocaleSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(`/${nextLocale}${pathname}`);
    });
  };

  return (
    <select 
      className="select-locale" 
      defaultValue={locale} 
      onChange={handleChange}
      disabled={isPending}
    >
      <option value="en">English</option>
      <option value="ar">العربية</option>
    </select>
  );
}
```

---

## 10. Next.js Configuration

### next.config.ts

```typescript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

export default withNextIntl({
  // Your existing Next.js config
});
```

---

## 11. Key Features

- **URL-based locale detection**: `/en/about` vs `/ar/about`
- **Automatic locale detection from browser preferences**
- **Fallback to default locale if locale not supported**
- **Server-side rendering with proper locale context**
- **Type-safe translation keys**
- **Dynamic import of translation files**
- **RTL support for Arabic**

---

## 12. Best Practices

1. **Organize translations by page/feature** (common.json, navigation.json, home.json, etc.)
2. **Use nested objects for related content** (category.rings, category.necklaces)
3. **Keep translation keys consistent across languages**
4. **Use descriptive keys** (e.g., `button.submit` instead of `btn1`)
5. **Test both languages thoroughly**
6. **Consider text expansion in Arabic** (Arabic text can be 20-30% longer than English)

---

## 13. Adding New Languages

1. Add the locale to `i18n/routing.ts`
2. Create new language folder in `messages/` (e.g., `messages/fr/`)
3. Copy and translate all JSON files
4. Update language switcher component

---

## 14. Common Issues & Solutions

### Issue: Translations not loading
- Check that `i18n/request.ts` imports all necessary message files
- Verify JSON files are valid
- Ensure middleware is properly configured

### Issue: Arabic text not displaying correctly
- Add RTL support in your CSS
- Use `dir="auto"` or `dir="rtl"` for Arabic content
- Test fonts that support Arabic characters

### Issue: Routes not working
- Ensure `app/[locale]/` structure is correct
- Check middleware configuration
- Verify `next.config.ts` includes the next-intl plugin

---

This implementation provides a robust, scalable internationalization solution that can be easily adapted for any Next.js project.
