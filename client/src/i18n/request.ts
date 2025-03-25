import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

export default getRequestConfig(async () => {
  // Await the headers object
  const requestHeaders = await headers();

  // Get the Accept-Language header from the resolved headers
  const acceptLanguage = requestHeaders.get("accept-language") || "";

  console.log("Accept-Language Header:", acceptLanguage);

  // Extract the user's preferred language (e.g., "en-US", "pt-BR")
  //   const userLocale = acceptLanguage.split(",")[0];
  const userLocale = "pt-BR";

  console.log("User Locale:", userLocale);
  // Define supported locales and fallback to a default locale
  const supportedLocales = ["en-US", "pt-BR"];
  const locale = supportedLocales.includes(userLocale) ? userLocale : "en-US";

  return {
    locale,
    messages: (await import(`../../locales/${locale}.json`)).default,
  };
});
