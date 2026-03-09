import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import pool from "@ricokahler/pool";
import { Translator, type TargetLanguageCode } from "deepl-node";
import { z } from "zod";

import enMessagesJson from "../locales/en/messages.json";

const ALL_CHROME_I18N_LANGUAGE_CODES = [
  "ar",
  "am",
  "bg",
  "bn",
  "ca",
  "cs",
  "da",
  "de",
  "el",
  "en",
  "en_AU",
  "en_GB",
  "en_US",
  "es",
  "es_419",
  "et",
  "fa",
  "fi",
  "fil",
  "fr",
  "gu",
  "he",
  "hi",
  "hr",
  "hu",
  "id",
  "it",
  "ja",
  "kn",
  "ko",
  "lt",
  "lv",
  "ml",
  "mr",
  "ms",
  "nl",
  "no",
  "pl",
  "pt_BR",
  "pt_PT",
  "ro",
  "ru",
  "sk",
  "sl",
  "sr",
  "sv",
  "sw",
  "ta",
  "te",
  "th",
  "tr",
  "uk",
  "vi",
  "zh_CN",
  "zh_TW",
] as const;

type ChromeI18nLanguageCode = (typeof ALL_CHROME_I18N_LANGUAGE_CODES)[number];

const languageCodeChromeToDeepL = (
  langChrome: ChromeI18nLanguageCode,
): TargetLanguageCode | null => {
  switch (langChrome) {
    // Not supported by DeepL
    case "am":
    case "kn":
      return null;

    // Supported by DeepL API but not yet in deepl-node type defs
    case "bn":
    case "ca":
    case "fa":
    case "gu":
    case "hi":
    case "hr":
    case "ml":
    case "mr":
    case "ms":
    case "sr":
    case "sw":
    case "ta":
    case "te":
      return langChrome as TargetLanguageCode;

    // Chrome "fil" (Filipino) → DeepL "tl" (Tagalog, not in type defs)
    case "fil":
      return "tl" as TargetLanguageCode;

    case "en":
    case "en_US":
      return "en-US";

    case "en_AU":
    case "en_GB":
      return "en-GB";

    case "es_419":
      return "es";

    case "pt_BR":
      return "pt-BR";

    case "pt_PT":
      return "pt-PT";

    case "zh_CN":
      return "zh-HANS";

    case "zh_TW":
      return "zh-HANT";

    case "no":
      return "nb";
  }

  return langChrome;
};

const getLocaleOverride = (lang: ChromeI18nLanguageCode) => {
  if (!existsSync(path.join("locale-overrides", lang, "messages.json"))) {
    return {};
  }

  return z
    .record(
      z.string(),
      z.object({
        message: z.string(),
      }),
    )
    .parse(
      JSON.parse(
        readFileSync(
          path.join("locale-overrides", lang, "messages.json"),
          "utf8",
        ),
      ),
    );
};

const writeMessagesJson = (lang: ChromeI18nLanguageCode, data: string) => {
  if (!existsSync(path.join("locales", lang))) {
    mkdirSync(path.join("locales", lang));
  }

  writeFileSync(path.join("locales", lang, "messages.json"), data);
};

const authKey = process.env.DEEPL_API_KEY;
if (!authKey) {
  console.error("DEEPL_API_KEY environment variable is required");
  process.exit(1);
}

const translator = new Translator(authKey);

const languageCodeDeepLToMessagesJson: Record<
  string,
  Record<string, { message: string }>
> = {};

const main = async () => {
  const limit = parseInt(process.argv[2]);

  const messagesToTranslate = Object.entries(enMessagesJson).filter(
    ([, val]) => "message" in val,
  );

  const allDeepLCodes = Array.from(
    new Set(
      ALL_CHROME_I18N_LANGUAGE_CODES.flatMap((lang) => {
        const l = languageCodeChromeToDeepL(lang);
        if (l === null) {
          return [];
        }

        return l;
      }),
    ),
  );

  // Optionally limit to N random languages for sanity checking
  const collection = isNaN(limit)
    ? allDeepLCodes
    : allDeepLCodes.sort(() => Math.random() - 0.5).slice(0, limit);

  console.log(
    `Translating ${messagesToTranslate.length} strings into ${collection.length} language(s)...`,
  );

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const results = await pool({
    collection,
    maxConcurrency: 1,
    task: async (lang) => {
      console.log(`Translating to ${lang}...`);

      return await pool({
        collection: messagesToTranslate,
        maxConcurrency: 1,
        task: async ([key, { message, description }]) => {
          for (let attempt = 0; ; attempt++) {
            try {
              const result = await translator.translateText(
                message,
                "en",
                lang,
                { context: description },
              );
              const translation = Array.isArray(result) ? result[0] : result;
              return [lang, { [key]: { message: translation.text } }] as const;
            } catch (e) {
              if (attempt >= 5) throw e;
              const delay = Math.pow(2, attempt) * 5000;
              console.log(`  Rate limited, retrying in ${delay / 1000}s...`);
              await sleep(delay);
            }
          }
        },
      });
    },
  });

  results.flat().forEach(([key, val]) => {
    languageCodeDeepLToMessagesJson[key] = {
      ...languageCodeDeepLToMessagesJson[key],
      ...val,
    };
  });

  ALL_CHROME_I18N_LANGUAGE_CODES.filter((lang) => lang !== "en").forEach(
    (lang) => {
      const l = languageCodeChromeToDeepL(lang);
      if (l === null) {
        return;
      }

      const messagesJson = languageCodeDeepLToMessagesJson[l];
      if (messagesJson === undefined) {
        return;
      }

      const localeOverride = getLocaleOverride(lang);

      for (const key in enMessagesJson) {
        const message = localeOverride[key];
        if (message === undefined) {
          continue;
        }

        messagesJson[key] = message;
      }

      writeMessagesJson(lang, JSON.stringify(messagesJson));
    },
  );

  console.log("Done!");
};

main();
