import en from "./en";
import zh from "./zh";
import type { DeepStringRecord } from "./en";

type Locale = typeof en;
type LocaleMap = Record<string, DeepStringRecord>;

const locales: LocaleMap = { en, zh };

/** Current locale — detected from Obsidian on first access, defaults to English */
let currentLocale: DeepStringRecord = en;
let detected = false;

/**
 * Type-safe access to Obsidian's global `app.vault.config.language`.
 * Obsidian injects `window.app` at runtime but its type isn't in the SDK.
 */
function getObsidianLanguage(): string {
  try {
    const w = window as unknown as { app?: { vault?: { config?: { language?: string } } } };
    return w.app?.vault?.config?.language ?? "en";
  } catch {
    return "en";
  }
}

/**
 * Type-safe two-level lookup on a DeepStringRecord.
 * Returns the string value at `obj[section][field]`, or undefined if missing.
 */
function lookupField(obj: DeepStringRecord, section: string, field: string): string | undefined {
  const group = obj[section];
  if (typeof group !== "object" || group === null) return undefined;
  const val = (group as Record<string, unknown>)[field];
  return typeof val === "string" ? val : undefined;
}

/**
 * Detect the effective locale from Obsidian's language setting.
 * Falls back to English on any failure.
 */
function detectLocale(): DeepStringRecord {
  const lang = getObsidianLanguage();
  return locales[lang] ?? en;
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
  // Lazy locale detection (once, cached via boolean flag)
  if (!detected) {
    detected = true;
    currentLocale = detectLocale();
  }

  const [section, field] = key.split(".", 2);
  const value = lookupField(currentLocale, section, field)
    ?? lookupField(en, section, field)
    ?? key;

  if (!vars) return value;

  // Escape '$' in replacement values to prevent String.replace backreferences
  return Object.entries(vars).reduce(
    (str, [k, v]) => str.replace(
      new RegExp(`\\{\\{${k}\\}\\}`, "g"),
      String(v).replace(/\$/g, "$$$$"),
    ),
    value,
  );
}

/**
 * Force a locale (useful for testing or user override).
 * Resets the detection flag so the explicit locale persists.
 */
export function setLocale(lang: string): void {
  detected = true;
  currentLocale = locales[lang] ?? en;
}
