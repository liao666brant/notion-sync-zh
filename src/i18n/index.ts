import en from "./en";
import zh from "./zh";
import type { DeepStringRecord } from "./en";

type Locale = typeof en;
type LocaleMap = Record<string, DeepStringRecord>;

const locales: LocaleMap = { en, zh: zh as DeepStringRecord };

/** Current locale — detected from Obsidian on first access, defaults to English */
let currentLocale: DeepStringRecord = en;

/**
 * Get the effective locale from Obsidian's language setting.
 * Called lazily on first t() invocation.
 */
function detectLocale(): DeepStringRecord {
  // Obsidian exposes the UI language on the global `app` object.
  // Falls back to English if detection fails.
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lang = (window as any)?.app?.vault?.config?.language ?? "en";
    return locales[lang] ?? en;
  } catch {
    return en;
  }
}

/**
 * Translate a dot-separated key. Template variables use `{{var}}` syntax.
 *
 * @example t("settings.notionApiToken")  → "Notion API 令牌"
 * @example t("notices.pulledFromNotion", { name: "note.md" })
 */
// Type-safe overloads for each top-level namespace
export function t(key: `settings.${keyof Locale["settings"]}`, vars?: Record<string, string | number>): string;
export function t(key: `commands.${keyof Locale["commands"]}`, vars?: Record<string, string | number>): string;
export function t(key: `notices.${keyof Locale["notices"]}`, vars?: Record<string, string | number>): string;
export function t(key: `progress.${keyof Locale["progress"]}`, vars?: Record<string, string | number>): string;
export function t(key: `panel.${keyof Locale["panel"]}`, vars?: Record<string, string | number>): string;
export function t(key: `statusBar.${keyof Locale["statusBar"]}`, vars?: Record<string, string | number>): string;
export function t(key: `history.${keyof Locale["history"]}`, vars?: Record<string, string | number>): string;
export function t(key: `log.${keyof Locale["log"]}`, vars?: Record<string, string | number>): string;
export function t(key: `utils.${keyof Locale["utils"]}`, vars?: Record<string, string | number>): string;
export function t(key: `sync.${keyof Locale["sync"]}`, vars?: Record<string, string | number>): string;
export function t(key: string, vars?: Record<string, string | number>): string;
export function t(key: string, vars?: Record<string, string | number>): string {
  // Lazy locale detection
  if (currentLocale === en) {
    currentLocale = detectLocale();
  }

  const [section, field] = key.split(".", 2);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value = (currentLocale as any)?.[section]?.[field] ?? key;

  if (!vars) return value;

  return Object.entries(vars).reduce(
    (str, [k, v]) => str.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), String(v)),
    value as string
  );
}

/**
 * Force a locale (useful for testing or user override).
 */
export function setLocale(lang: string): void {
  currentLocale = locales[lang] ?? en;
}
