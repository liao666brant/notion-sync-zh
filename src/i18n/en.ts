/** Locale type — all leaf values are strings */
export type DeepStringRecord = {
  [key: string]: string | DeepStringRecord;
};

/** English translations */
const en = {
  // ── Settings Tab ──────────────────────────────────────────
  settings: {
    // Connection section
    connection: "Connection",
    notionApiToken: "Notion API token",
    notionApiTokenDesc: "Your Notion integration secret token. Create one at notion.so/my-integrations.",
    notionApiTokenPlaceholder: "Secret_...",
    rootPageId: "Root Notion page ID",
    rootPageIdDesc: "The ID of the Notion page that will serve as the vault root. Find it in the page URL: notion.so/Page-Title-<PAGE_ID>.",
    rootPageIdPlaceholder: "Abc123...",
    testConnection: "Test connection",
    testConnectionDesc: "Verify that the plugin can connect to Notion.",
    test: "Test",
    testing: "Testing...",
    connected: "Connected!",
    failed: "Failed",

    // Sync mode section
    syncMode: "Sync mode",
    syncModeDesc: "When to automatically sync files to Notion.",
    manualOnly: "Manual only",
    currentFileOnCommand: "Current file on command",
    autoSyncOnSave: "Auto sync on save",
    scheduledInterval: "Scheduled interval",
    syncIntervalMinutes: "Sync interval (minutes)",
    syncIntervalMinutesDesc: "How often to run automatic sync.",

    // Content section
    content: "Content",
    syncAttachments: "Sync attachments",
    syncAttachmentsDesc: "Include images, PDFs, and other embedded files. Requires an upload endpoint for local files.",
    attachmentUploadUrl: "Attachment upload URL",
    attachmentUploadUrlDesc: "POST endpoint for uploading local files. Should accept multipart/form-data and return { url: string }. Leave empty to show placeholders for local attachments.",
    attachmentUploadUrlPlaceholder: "https://your-upload-service.com/upload",
    syncMetadata: "Sync metadata",
    syncMetadataDesc: "Include YAML frontmatter as a metadata block in Notion pages.",
    downloadImages: "Download images on pull",
    downloadImagesDesc: "When pulling from Notion, download images to a local _attachments folder and replace URLs with Obsidian ![[filename]] embeds.",

    // Status section
    status: "Status",
    syncedFiles: "Synced files: {{count}}",
    syncedFolders: "Synced folders: {{count}}",
    lastFullSync: "Last full sync: {{date}}",

    // Danger zone section
    dangerZone: "Danger zone",
    resetSyncState: "Reset sync state",
    resetSyncStateDesc: "Clear all sync mappings. The next sync will treat everything as new. Existing Notion pages will NOT be deleted.",
    reset: "Reset",
  },

  // ── Commands (main.ts) ───────────────────────────────────
  commands: {
    ribbonTooltip: "Notion sync",
    syncFullVault: "Sync entire vault to Notion",
    syncCurrentFile: "Sync current note to Notion",
    syncIncremental: "Sync changed files to Notion",
    rebuildHierarchy: "Rebuild Notion hierarchy",
    openSyncLog: "Open sync log",
    openSyncPanel: "Open sync panel",
    pullCurrentFile: "Pull current note from Notion",
    pullAll: "Pull all notes from Notion",
    pullNewPages: "Pull new pages from Notion",
  },

  // ── Notices & Status Messages ────────────────────────────
  notices: {
    fillTokenAndPageId: "Please fill in token and root page ID first",
    connectionSuccessful: "Connection successful!",
    connectionFailedNotFound: "Connection failed: page not found or not shared with integration.",
    connectionFailed: "Connection failed: {{error}}",
    noActiveFile: "No active file",
    pulledFromNotion: "Pulled from Notion: {{name}}",
    alreadyUpToDate: "Already up to date: {{name}}",
    notSyncedYet: "Not synced yet — push to Notion first: {{name}}",
    done: "Done: {{name}}",
    noSnapshot: "No snapshot available",
    fileNotFound: "File not found",
    rolledBack: "Rolled back: {{name}}",
  },

  // ── Progress Messages ────────────────────────────────────
  progress: {
    starting: "Starting...",
    startingFullSync: "Starting full sync...",
    startingIncrementalSync: "Starting incremental sync...",
    startingPull: "Starting pull...",
    startingPullNewPages: "Starting pull new pages...",
  },

  // ── Sync Panel ───────────────────────────────────────────
  panel: {
    title: "Notion sync",
    pushVaultLabel: "Push vault to Notion",
    pushVaultTooltip: "Push: sync entire vault to Notion",
    syncChanged: "Sync Changed",
    syncChangedTooltip: "Push: Sync changed files to Notion",
    pushNote: "Push Note",
    pushNoteTooltip: "Push: Sync current note to Notion",
    pullAll: "Pull All",
    pullAllTooltip: "Pull: All notes from Notion",
    pullNew: "Pull New",
    pullNewTooltip: "Pull new pages from Notion",
    files: "Files",
    folders: "Folders",
    autoSyncMode: "Auto sync mode",
    manual: "Manual",
    onSave: "On save",
    scheduled: "Scheduled",
    every: "Every",
    minute: "{{n}} min",
    history: "History",
    logs: "Logs",
    lastSync: "Last sync: {{time}}",
    neverSynced: "Never synced",
    ready: "Ready",
    error: "Error",
    syncing: "Syncing",
    changes: "Changes",
    everythingSynced: "Everything is synced",
    notSyncedYet: "Not synced yet",
    modifiedSinceLastSync: "Modified since last sync",
    pushFileToNotion: "Push {{name}} to Notion",
  },

  // ── Status Bar ───────────────────────────────────────────
  statusBar: {
    synced: "☁ Synced {{time}}",
    ready: "☁ ready",
    syncing: "⟳ syncing...",
    syncError: "⚠ sync error",
  },

  // ── History Modal ────────────────────────────────────────
  history: {
    title: "Sync history",
    empty: "No sync history yet.",
    pushedToNotion: "Pushed to Notion",
    pulledFromNotion: "Pulled from Notion",
    newPagePulled: "New page pulled",
    rollback: "↩ rollback",
    rollingBack: "Rolling back...",
    done: "Done",
    failed: "Failed",
  },

  // ── Sync Log Modal ───────────────────────────────────────
  log: {
    title: "Sync log",
    all: "All",
    info: "Info",
    warnings: "Warnings",
    errors: "Errors",
    clear: "Clear",
    clearAll: "Clear all log entries",
    stats: "Total: {{total}} entries | {{info}} info, {{warns}} warnings, {{errors}} errors",
    noEntries: "No log entries.",
  },

  // ── Utils ────────────────────────────────────────────────
  utils: {
    justNow: "just now",
    minutesAgo: "{{n}}m ago",
    hoursAgo: "{{n}}h ago",
    yesterday: "yesterday",
    daysAgo: "{{n}}d ago",
    untitled: "Untitled",
  },

  // ── Sync Messages (logs & notices from push/pull services) ──
  sync: {
    startingFullVaultSync: "Starting full vault sync",
    startingFullVaultSyncNotice: "Starting full vault sync...",
    syncAborted: "Sync aborted by user",
    syncingProgress: "Syncing... {{i}}/{{total}}",
    syncingReport: "Syncing {{i}}/{{total}}...",
    fullSyncComplete: "Full sync complete: {{synced}} synced, {{errors}} errors",
    syncCompleteNotice: "Sync complete: {{synced}} files synced, {{errors}} errors",
    fullSyncFailed: "Full sync failed: {{error}}",
    syncFailedNotice: "Sync failed: {{error}}",
    failedToSync: "Failed to sync: {{error}}",
    startingIncrementalSync: "Starting incremental sync",
    incrementalSyncComplete: "Incremental sync: {{synced}} updated, {{errors}} errors",
    incrementalSyncNotice: "Incremental sync: {{synced}} updated, {{errors}} errors",
    incrementalSyncFailed: "Incremental sync failed: {{error}}",
    syncedFile: "Synced: {{name}}",
    updated: "Updated: {{path}}",
    pageMissingRecreating: "Notion page missing or archived — recreating: {{path}}",
    created: "Created: {{path}}",
    resolvingLinks: "Resolving internal links...",
    linkResolutionFailed: "Link resolution failed: {{error}}",
    removedMapping: "Removed mapping for deleted: {{path}}",
    startingPull: "Starting pull from Notion",
    pullingNotice: "Pulling from Notion...",
    pullingProgress: "Pulling {{i}}/{{total}}...",
    pullComplete: "Pull complete: {{pulled}} updated, {{errors}} errors",
    pullFailed: "Pull failed: {{error}}",
    pulledFile: "Pulled from Notion: {{path}}",
    rebuildingHierarchy: "Rebuilding Notion hierarchy",
    rebuildingHierarchyNotice: "Rebuilding hierarchy... This may take a while.",
    syncAlreadyInProgress: "Sync already in progress",
    configureTokenFirst: "Please configure your Notion API token in settings",
    configureRootPageFirst: "Please configure your root Notion page ID in settings",
    startingPullNewPages: "Starting pull new pages from Notion",
    pullingNewPagesNotice: "Pulling new pages from Notion...",
    attachmentNotFound: "Attachment not found: {{name}}",
    fileNotFoundInVault: "File not found in vault",
    unsupportedEmbedType: "Unsupported embed type: .{{ext}}",
    uploadFailed: "Upload failed",
    configureUploadUrlForImages: "Configure attachment upload URL in settings to sync images",
    configureUploadUrlForPdfs: "Configure upload URL for PDF embeds",
    pullNewPagesComplete: "Pull new pages complete: {{created}} created, {{errors}} errors",
    pullNewPagesFailed: "Pull new pages failed: {{error}}",
    couldNotFetchChildren: "Could not fetch children of {{id}}: {{error}}",
    checkingPages: "Checking pages... {{title}}",
    createdFromNotion: "Created from Notion: {{path}}",
    failedToCreatePage: "Failed to create page {{title}}: {{error}}",
    failedToUpload: "Failed to upload {{name}}: {{error}}",
  },
} as const satisfies DeepStringRecord;

export default en;
