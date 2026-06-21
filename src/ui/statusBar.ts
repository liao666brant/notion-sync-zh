import type { StateManager } from "../stateManager";
import { formatTimeAgo } from "../utils";
import { t } from "../i18n";

export type StatusBarState = "idle" | "syncing" | "error";

/**
 * Owns the plugin's status bar item: renders the current sync state and
 * the time of the last full sync.
 */
export class StatusBarController {
  constructor(
    private readonly el: HTMLElement,
    private readonly stateManager: StateManager
  ) {}

  update(state: StatusBarState): void {
    this.el.removeClass("notion-sync-status-error");

    switch (state) {
      case "idle": {
        const lastSync = this.stateManager.lastFullSync;
        if (lastSync > 0) {
          this.el.setText(t("statusBar.synced", { time: formatTimeAgo(lastSync) }));
        } else {
          this.el.setText(t("statusBar.ready"));
        }
        break;
      }
      case "syncing":
        this.el.setText(t("statusBar.syncing"));
        break;
      case "error":
        this.el.setText(t("statusBar.syncError"));
        this.el.addClass("notion-sync-status-error");
        break;
    }
  }
}
