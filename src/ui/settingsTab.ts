import { App, PluginSettingTab, Setting } from "obsidian";
import type NotionSyncPlugin from "../main";
import { SyncMode } from "../types";
import { t } from "../i18n";

/**
 * Settings UI tab for the Notion Sync plugin. Each section of the tab
 * is built by its own method to keep display() a readable outline.
 */
export class NotionSyncSettingTab extends PluginSettingTab {
  plugin: NotionSyncPlugin;

  constructor(app: App, plugin: NotionSyncPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    this.addConnectionSection(containerEl);
    this.addSyncModeSection(containerEl);
    this.addContentSection(containerEl);
    this.addStatusSection(containerEl);
    this.addDangerZone(containerEl);
  }

  // ── Connection ────────────────────────────────────────────

  private addConnectionSection(containerEl: HTMLElement): void {
    new Setting(containerEl).setName(t("settings.connection")).setHeading();

    new Setting(containerEl)
      .setName(t("settings.notionApiToken"))
      .setDesc(t("settings.notionApiTokenDesc"))
      .addText((text) =>
        text
          .setPlaceholder(t("settings.notionApiTokenPlaceholder"))
          .setValue(this.plugin.settings.notionToken)
          .onChange(async (value) => {
            this.plugin.settings.notionToken = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(t("settings.rootPageId"))
      .setDesc(t("settings.rootPageIdDesc"))
      .addText((text) =>
        text
          .setPlaceholder(t("settings.rootPageIdPlaceholder"))
          .setValue(this.plugin.settings.rootPageId)
          .onChange(async (value) => {
            this.plugin.settings.rootPageId = value.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(t("settings.testConnection"))
      .setDesc(t("settings.testConnectionDesc"))
      .addButton((button) =>
        button.setButtonText(t("settings.test")).onClick(async () => {
          button.setButtonText(t("settings.testing"));
          button.setDisabled(true);
          try {
            const ok = await this.plugin.testConnection();
            button.setButtonText(ok ? t("settings.connected") : t("settings.failed"));
          } catch {
            button.setButtonText(t("settings.failed"));
          }
          window.setTimeout(() => {
            button.setButtonText(t("settings.test"));
            button.setDisabled(false);
          }, 2000);
        })
      );
  }

  // ── Sync Mode ─────────────────────────────────────────────

  private addSyncModeSection(containerEl: HTMLElement): void {
    new Setting(containerEl).setName(t("settings.syncMode")).setHeading();

    new Setting(containerEl)
      .setName(t("settings.syncMode"))
      .setDesc(t("settings.syncModeDesc"))
      .addDropdown((dropdown) =>
        dropdown
          .addOption(SyncMode.Manual, t("settings.manualOnly"))
          .addOption(SyncMode.CurrentFile, t("settings.currentFileOnCommand"))
          .addOption(SyncMode.OnSave, t("settings.autoSyncOnSave"))
          .addOption(SyncMode.Scheduled, t("settings.scheduledInterval"))
          .setValue(this.plugin.settings.syncMode)
          .onChange(async (value) => {
            this.plugin.settings.syncMode = value as SyncMode;
            await this.plugin.saveSettings();
            this.plugin.configureSyncMode();
            this.display();
          })
      );

    if (this.plugin.settings.syncMode === SyncMode.Scheduled) {
      new Setting(containerEl)
        .setName(t("settings.syncIntervalMinutes"))
        .setDesc(t("settings.syncIntervalMinutesDesc"))
        .addSlider((slider) =>
          slider
            .setLimits(5, 120, 5)
            .setValue(this.plugin.settings.scheduledIntervalMinutes)
            .setDynamicTooltip()
            .onChange(async (value) => {
              this.plugin.settings.scheduledIntervalMinutes = value;
              await this.plugin.saveSettings();
              this.plugin.configureSyncMode();
            })
        );
    }
  }

  // ── Content Options ───────────────────────────────────────

  private addContentSection(containerEl: HTMLElement): void {
    new Setting(containerEl).setName(t("settings.content")).setHeading();

    new Setting(containerEl)
      .setName(t("settings.syncAttachments"))
      .setDesc(t("settings.syncAttachmentsDesc"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.syncAttachments)
          .onChange(async (value) => {
            this.plugin.settings.syncAttachments = value;
            await this.plugin.saveSettings();
            this.display();
          })
      );

    if (this.plugin.settings.syncAttachments) {
      new Setting(containerEl)
        .setName(t("settings.attachmentUploadUrl"))
        .setDesc(t("settings.attachmentUploadUrlDesc"))
        .addText((text) =>
          text
            .setPlaceholder(t("settings.attachmentUploadUrlPlaceholder"))
            .setValue(this.plugin.settings.attachmentUploadUrl)
            .onChange(async (value) => {
              this.plugin.settings.attachmentUploadUrl = value.trim();
              await this.plugin.saveSettings();
            })
        );
    }

    new Setting(containerEl)
      .setName(t("settings.syncMetadata"))
      .setDesc(t("settings.syncMetadataDesc"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.syncMetadata)
          .onChange(async (value) => {
            this.plugin.settings.syncMetadata = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(t("settings.downloadImages"))
      .setDesc(t("settings.downloadImagesDesc"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.downloadImages)
          .onChange(async (value) => {
            this.plugin.settings.downloadImages = value;
            await this.plugin.saveSettings();
          })
      );
  }

  // ── Status ────────────────────────────────────────────────

  private addStatusSection(containerEl: HTMLElement): void {
    new Setting(containerEl).setName(t("settings.status")).setHeading();

    const statusEl = containerEl.createDiv({ cls: "notion-sync-status" });
    statusEl.createEl("p", {
      text: t("settings.syncedFiles", { count: this.plugin.stateManager.syncedFileCount }),
    });
    statusEl.createEl("p", {
      text: t("settings.syncedFolders", { count: this.plugin.stateManager.syncedFolderCount }),
    });

    const lastSync = this.plugin.stateManager.lastFullSync;
    if (lastSync > 0) {
      statusEl.createEl("p", {
        text: t("settings.lastFullSync", { date: new Date(lastSync).toLocaleString() }),
      });
    }
  }

  // ── Danger Zone ───────────────────────────────────────────

  private addDangerZone(containerEl: HTMLElement): void {
    new Setting(containerEl).setName(t("settings.dangerZone")).setHeading();

    new Setting(containerEl)
      .setName(t("settings.resetSyncState"))
      .setDesc(t("settings.resetSyncStateDesc"))
      .addButton((button) =>
        button
          .setButtonText(t("settings.reset"))
          .setWarning()
          .onClick(async () => {
            this.plugin.stateManager.reset();
            await this.plugin.saveState();
            this.display();
          })
      );
  }
}
