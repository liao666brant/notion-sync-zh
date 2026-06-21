import { ItemView, TFile, WorkspaceLeaf, setIcon } from "obsidian";
import type NotionSyncPlugin from "../main";
import { SyncMode } from "../types";
import { ChangesList } from "./changesList";
import { t } from "../i18n";

export const SYNC_PANEL_VIEW_TYPE = "notion-sync-panel";

/**
 * Side panel view for Notion Sync — similar to VS Code's Source Control panel.
 * Shows sync controls and status at the top of the right sidebar.
 */
export class SyncPanelView extends ItemView {
  private plugin: NotionSyncPlugin;
  private statusEl: HTMLElement | null = null;
  private refreshInterval: number | null = null;
  private progressEl: HTMLElement | null = null;
  private progressFillEl: HTMLElement | null = null;
  private progressTextEl: HTMLElement | null = null;

  // New UI Elements
  private badgeEl: HTMLElement | null = null;
  private filesCountEl: HTMLElement | null = null;
  private foldersCountEl: HTMLElement | null = null;
  private lastSyncEl: HTMLElement | null = null;
  private changesRefreshDebounce: number | null = null;
  private isSyncing = false;
  private hasError = false;
  private readonly changesList: ChangesList;

  constructor(leaf: WorkspaceLeaf, plugin: NotionSyncPlugin) {
    super(leaf);
    this.plugin = plugin;
    this.changesList = new ChangesList({
      scan: () => this.plugin.scanPendingChanges(),
      onOpenFile: (path) => { void this.openFile(path); },
      onPushFile: (path) => this.pushSingleChange(path),
    });
  }

  getViewType(): string {
    return SYNC_PANEL_VIEW_TYPE;
  }

  getDisplayText(): string {
    return t("panel.title");
  }

  getIcon(): string {
    return "upload-cloud";
  }

  onOpen(): Promise<void> {
    this.render();
    // Refresh status every 30s
    this.refreshInterval = window.setInterval(() => this.refreshStatus(), 30_000);

    // Keep the changes list in step with vault edits (debounced)
    const scheduleChangesRefresh = (): void => {
      if (this.changesRefreshDebounce) window.clearTimeout(this.changesRefreshDebounce);
      this.changesRefreshDebounce = window.setTimeout(() => {
        this.changesRefreshDebounce = null;
        void this.refreshChanges();
      }, 800);
    };
    this.registerEvent(this.app.vault.on("modify", scheduleChangesRefresh));
    this.registerEvent(this.app.vault.on("create", scheduleChangesRefresh));
    this.registerEvent(this.app.vault.on("delete", scheduleChangesRefresh));
    this.registerEvent(this.app.vault.on("rename", scheduleChangesRefresh));
    return Promise.resolve();
  }

  onClose(): Promise<void> {
    if (this.refreshInterval !== null) {
      window.clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    if (this.changesRefreshDebounce !== null) {
      window.clearTimeout(this.changesRefreshDebounce);
      this.changesRefreshDebounce = null;
    }
    return Promise.resolve();
  }

  /** Full re-render (called on open or mode change) */
  render(): void {
    const root = this.containerEl.children[1] as HTMLElement;
    root.empty();
    root.addClass("notion-sync-panel");

    // ── Header & Status Brand ────────────────────────────────
    const header = root.createDiv({ cls: "notion-sync-header" });
    const brand = header.createDiv({ cls: "notion-sync-brand" });
    brand.createEl("h3", { text: t("panel.title") });
    this.badgeEl = header.createDiv();
    this.updateStatusBadge();

    // ── Actions Card ──────────────────────────────────────────
    const actionsCard = root.createDiv({ cls: "notion-sync-actions-card" });

    // Primary Action (Push Vault)
    const pushBtn = actionsCard.createEl("button", {
      cls: "notion-sync-btn-primary",
      attr: { "aria-label": t("panel.pushVaultTooltip") }
    });
    setIcon(pushBtn, "upload-cloud");
    pushBtn.createSpan({ text: t("panel.pushVaultLabel") });
    pushBtn.addEventListener("click", () => {
      void this.runAction(() => this.plugin.syncFullVaultPublic());
    });

    // Action Grid for quick actions
    const grid = actionsCard.createDiv({ cls: "notion-sync-action-grid" });

    this.addGridBtn(grid, "refresh-cw", t("panel.syncChanged"), t("panel.syncChangedTooltip"), () => {
      void this.runAction(() => this.plugin.syncIncrementalPublic());
    });

    this.addGridBtn(grid, "file-up", t("panel.pushNote"), t("panel.pushNoteTooltip"), () => {
      void this.runAction(() => this.plugin.syncCurrentFilePublic());
    });

    this.addGridBtn(grid, "download-cloud", t("panel.pullAll"), t("panel.pullAllTooltip"), () => {
      void this.runAction(() => this.plugin.pullAllPublic());
    });

    this.addGridBtn(grid, "folder-down", t("panel.pullNew"), t("panel.pullNewTooltip"), () => {
      void this.runAction(() => this.plugin.pullNewPagesPublic());
    });

    // ── Progress bar ───────────────────────────────────────────
    this.progressEl = root.createDiv({ cls: "notion-sync-progress notion-sync-progress-hidden" });

    const progressBar = this.progressEl.createDiv({ cls: "notion-sync-progress-bar" });
    this.progressFillEl = progressBar.createDiv({ cls: "notion-sync-progress-fill" });
    this.progressTextEl = this.progressEl.createDiv({ cls: "notion-sync-progress-text" });

    // ── Changes (files a push would send, like git status) ────
    this.changesList.mount(root);

    // ── Stats Cards ────────────────────────────────────────────
    const statsContainer = root.createDiv({ cls: "notion-sync-stats-container" });

    const filesCard = statsContainer.createDiv({ cls: "notion-sync-stat-card" });
    this.filesCountEl = filesCard.createDiv({ cls: "notion-sync-stat-val" });
    filesCard.createDiv({ cls: "notion-sync-stat-lbl", text: t("panel.files") });

    const foldersCard = statsContainer.createDiv({ cls: "notion-sync-stat-card" });
    this.foldersCountEl = foldersCard.createDiv({ cls: "notion-sync-stat-val" });
    foldersCard.createDiv({ cls: "notion-sync-stat-lbl", text: t("panel.folders") });

    // ── Mode selector card ─────────────────────────────────────
    const modeCard = root.createDiv({ cls: "notion-sync-card-section" });
    modeCard.createEl("p", { text: t("panel.autoSyncMode"), cls: "notion-sync-card-section-title" });

    const selectWrapper = modeCard.createDiv({ cls: "notion-sync-select-wrapper" });
    const modeSelect = selectWrapper.createEl("select", { cls: "notion-sync-select" });
    const options: [SyncMode, string][] = [
      [SyncMode.Manual, t("panel.manual")],
      [SyncMode.OnSave, t("panel.onSave")],
      [SyncMode.Scheduled, t("panel.scheduled")],
    ];
    for (const [value, label] of options) {
      const opt = modeSelect.createEl("option", { text: label, value });
      if (this.plugin.settings.syncMode === value) opt.selected = true;
    }

    modeSelect.addEventListener("change", () => {
      void (async () => {
        this.plugin.settings.syncMode = modeSelect.value as SyncMode;
        await this.plugin.saveSettings();
        this.plugin.configureSyncMode();
        this.render();
      })();
    });

    // Interval picker (only visible in Scheduled mode)
    if (this.plugin.settings.syncMode === SyncMode.Scheduled) {
      const intervalRow = modeCard.createDiv({ cls: "notion-sync-mode-row" });
      intervalRow.createEl("span", { text: t("panel.every"), cls: "notion-sync-interval-label" });

      const intervalSelect = intervalRow.createEl("select", { cls: "notion-sync-select" });
      for (const mins of [5, 10, 15, 30, 60]) {
        const opt = intervalSelect.createEl("option", { text: t("panel.minute", { n: mins }), value: String(mins) });
        if (this.plugin.settings.scheduledIntervalMinutes === mins) opt.selected = true;
      }

      intervalSelect.addEventListener("change", () => {
        void (async () => {
          this.plugin.settings.scheduledIntervalMinutes = Number(intervalSelect.value);
          await this.plugin.saveSettings();
          this.plugin.configureSyncMode();
        })();
      });
    }

    // Last Sync status
    this.lastSyncEl = modeCard.createDiv({ cls: "notion-sync-last-sync-block" });

    // ── Footer Utilities ───────────────────────────────────────
    const footer = root.createDiv({ cls: "notion-sync-footer" });

    const historyBtn = footer.createEl("button", {
      cls: "notion-sync-footer-btn",
    });
    setIcon(historyBtn, "history");
    historyBtn.createSpan({ text: t("panel.history") });
    historyBtn.addEventListener("click", () => this.plugin.openHistoryModal());

    const logBtn = footer.createEl("button", {
      cls: "notion-sync-footer-btn",
    });
    setIcon(logBtn, "list");
    logBtn.createSpan({ text: t("panel.logs") });
    logBtn.addEventListener("click", () => this.plugin.openSyncLogPublic());

    this.refreshStatus();
  }

  /** Update just the status block without full re-render */
  refreshStatus(): void {
    const sm = this.plugin.stateManager;
    void this.refreshChanges();

    if (this.filesCountEl) {
      this.filesCountEl.setText(String(sm.syncedFileCount));
    }
    if (this.foldersCountEl) {
      this.foldersCountEl.setText(String(sm.syncedFolderCount));
    }

    if (this.lastSyncEl) {
      this.lastSyncEl.empty();
      setIcon(this.lastSyncEl, "clock");
      const last = sm.lastFullSync;
      this.lastSyncEl.createSpan({
        text: last > 0
          ? t("panel.lastSync", { time: new Date(last).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
          : t("panel.neverSynced"),
      });
    }
  }

  /** Rebuild the pending-changes list (like git status) */
  async refreshChanges(): Promise<void> {
    await this.changesList.refresh();
  }

  private async openFile(path: string): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (file instanceof TFile) {
      await this.app.workspace.getLeaf(false).openFile(file);
    }
  }

  private async pushSingleChange(path: string): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) return;
    await this.runAction(() => this.plugin.pushFile(file));
  }

  private updateStatusBadge(): void {
    if (!this.badgeEl) return;
    this.badgeEl.empty();

    let statusClass = "status-connected";
    let statusText = t("panel.ready");

    if (this.hasError) {
      statusClass = "status-error";
      statusText = t("panel.error");
    } else if (this.isSyncing) {
      statusClass = "status-syncing";
      statusText = t("panel.syncing");
    }

    this.badgeEl.className = `notion-sync-status-badge ${statusClass}`;
    this.badgeEl.createDiv({ cls: "notion-sync-pulsing-dot" });
    this.badgeEl.createSpan({ text: statusText });
  }

  /** Show a progress bar with text and percentage */
  showProgress(text: string, percent: number): void {
    this.isSyncing = true;
    this.hasError = false;
    this.updateStatusBadge();

    if (!this.progressEl || !this.progressFillEl || !this.progressTextEl) return;
    this.progressEl.removeClass("notion-sync-progress-hidden");
    this.progressFillEl.setCssProps({ "--fill-width": `${Math.max(0, Math.min(100, percent))}%` });
    
    // Split the text to show progress details elegantly
    this.progressTextEl.empty();
    this.progressTextEl.createSpan({ text });
    this.progressTextEl.createSpan({ text: `${Math.round(percent)}%` });
  }

  /** Hide the progress bar */
  hideProgress(): void {
    this.isSyncing = false;
    this.updateStatusBadge();

    if (!this.progressEl) return;
    this.progressEl.addClass("notion-sync-progress-hidden");
    if (this.progressFillEl) this.progressFillEl.setCssProps({ "--fill-width": "0%" });
    if (this.progressTextEl) this.progressTextEl.setText("");
  }

  // ── Helpers ────────────────────────────────────────────────

  private addGridBtn(
    container: HTMLElement,
    iconName: string,
    label: string,
    tooltip: string,
    onClick: () => void
  ): HTMLElement {
    const btn = container.createEl("button", {
      cls: "notion-sync-grid-btn",
      attr: { "aria-label": tooltip },
    });
    setIcon(btn, iconName);
    btn.createSpan({ text: label });
    btn.addEventListener("click", onClick);
    return btn;
  }

  private async runAction(action: () => Promise<void>): Promise<void> {
    try {
      this.isSyncing = true;
      this.hasError = false;
      this.updateStatusBadge();
      await action();
      this.isSyncing = false;
      this.updateStatusBadge();
      this.refreshStatus();
    } catch (e) {
      this.isSyncing = false;
      this.hasError = true;
      this.updateStatusBadge();
      console.error("[NotionSync] panel action error:", e);
    }
  }
}
