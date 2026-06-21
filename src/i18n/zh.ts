import type { DeepStringRecord } from "./en";

/** 中文翻译 */
const zh: DeepStringRecord = {
  // ── 设置页 ───────────────────────────────────────────────
  settings: {
    // 连接
    connection: "连接",
    notionApiToken: "Notion API 令牌",
    notionApiTokenDesc: "Notion 集成密钥。在 notion.so/my-integrations 创建。",
    notionApiTokenPlaceholder: "Secret_...",
    rootPageId: "根页面 ID",
    rootPageIdDesc: "作为知识库根节点的 Notion 页面 ID。从页面 URL 中获取：notion.so/Page-Title-<PAGE_ID>。",
    rootPageIdPlaceholder: "Abc123...",
    testConnection: "测试连接",
    testConnectionDesc: "验证插件能否连接到 Notion。",
    test: "测试",
    testing: "测试中...",
    connected: "连接成功！",
    failed: "失败",

    // 同步模式
    syncMode: "同步模式",
    syncModeDesc: "何时自动将文件同步到 Notion。",
    manualOnly: "仅手动",
    currentFileOnCommand: "命令同步当前文件",
    autoSyncOnSave: "保存时自动同步",
    scheduledInterval: "定时同步",
    syncIntervalMinutes: "同步间隔（分钟）",
    syncIntervalMinutesDesc: "自动同步的频率。",

    // 内容
    content: "内容",
    syncAttachments: "同步附件",
    syncAttachmentsDesc: "包含图片、PDF 等嵌入文件。本地文件需要上传端点。",
    attachmentUploadUrl: "附件上传地址",
    attachmentUploadUrlDesc: "用于上传本地文件的 POST 端点。需接受 multipart/form-data 并返回 { url: string }。留空则显示占位符。",
    attachmentUploadUrlPlaceholder: "https://your-upload-service.com/upload",
    syncMetadata: "同步元数据",
    syncMetadataDesc: "将 YAML frontmatter 作为元数据块包含在 Notion 页面中。",
    downloadImages: "拉取时下载图片",
    downloadImagesDesc: "从 Notion 拉取时，将图片下载到本地 _attachments 文件夹，并将 URL 替换为 Obsidian ![[filename]] 嵌入格式。",

    // 状态
    status: "状态",
    syncedFiles: "已同步文件：{{count}}",
    syncedFolders: "已同步文件夹：{{count}}",
    lastFullSync: "上次全量同步：{{date}}",

    // 危险区域
    dangerZone: "危险区域",
    resetSyncState: "重置同步状态",
    resetSyncStateDesc: "清除所有同步映射。下次同步将视为全新内容。已有的 Notion 页面不会被删除。",
    reset: "重置",
  },

  // ── 命令 ─────────────────────────────────────────────────
  commands: {
    ribbonTooltip: "Notion 同步",
    syncFullVault: "同步整个知识库到 Notion",
    syncCurrentFile: "同步当前笔记到 Notion",
    syncIncremental: "同步已更改的文件到 Notion",
    rebuildHierarchy: "重建 Notion 层级结构",
    openSyncLog: "打开同步日志",
    openSyncPanel: "打开同步面板",
    pullCurrentFile: "从 Notion 拉取当前笔记",
    pullAll: "从 Notion 拉取所有笔记",
    pullNewPages: "从 Notion 拉取新页面",
  },

  // ── 通知 & 状态消息 ──────────────────────────────────────
  notices: {
    fillTokenAndPageId: "请先填写令牌和根页面 ID",
    connectionSuccessful: "连接成功！",
    connectionFailedNotFound: "连接失败：页面未找到或未共享给集成。",
    connectionFailed: "连接失败：{{error}}",
    noActiveFile: "没有活动文件",
    pulledFromNotion: "已从 Notion 拉取：{{name}}",
    alreadyUpToDate: "已是最新：{{name}}",
    notSyncedYet: "尚未同步——请先推送到 Notion：{{name}}",
    done: "完成：{{name}}",
    noSnapshot: "没有可用快照",
    fileNotFound: "文件未找到",
    rolledBack: "已回滚：{{name}}",
  },

  // ── 进度消息 ─────────────────────────────────────────────
  progress: {
    starting: "开始...",
    startingFullSync: "开始全量同步...",
    startingIncrementalSync: "开始增量同步...",
    startingPull: "开始拉取...",
    startingPullNewPages: "开始拉取新页面...",
  },

  // ── 同步面板 ─────────────────────────────────────────────
  panel: {
    title: "Notion 同步",
    pushVaultLabel: "推送知识库到 Notion",
    pushVaultTooltip: "推送：同步整个知识库到 Notion",
    syncChanged: "同步变更",
    syncChangedTooltip: "推送：同步已更改的文件到 Notion",
    pushNote: "推送笔记",
    pushNoteTooltip: "推送：同步当前笔记到 Notion",
    pullAll: "拉取全部",
    pullAllTooltip: "拉取：从 Notion 拉取所有笔记",
    pullNew: "拉取新增",
    pullNewTooltip: "从 Notion 拉取新页面",
    files: "文件",
    folders: "文件夹",
    autoSyncMode: "自动同步模式",
    manual: "手动",
    onSave: "保存时",
    scheduled: "定时",
    every: "每隔",
    minute: "{{n}} 分钟",
    history: "历史",
    logs: "日志",
    lastSync: "上次同步：{{time}}",
    neverSynced: "从未同步",
    ready: "就绪",
    error: "错误",
    syncing: "同步中",
    changes: "变更",
    everythingSynced: "全部已同步",
    notSyncedYet: "尚未同步",
    modifiedSinceLastSync: "上次同步后已修改",
    pushFileToNotion: "推送 {{name}} 到 Notion",
  },

  // ── 状态栏 ───────────────────────────────────────────────
  statusBar: {
    synced: "☁ 已同步 {{time}}",
    ready: "☁ 就绪",
    syncing: "⟳ 同步中...",
    syncError: "⚠ 同步错误",
  },

  // ── 历史弹窗 ─────────────────────────────────────────────
  history: {
    title: "同步历史",
    empty: "暂无同步历史。",
    pushedToNotion: "已推送到 Notion",
    pulledFromNotion: "已从 Notion 拉取",
    newPagePulled: "已拉取新页面",
    rollback: "↩ 回滚",
    rollingBack: "回滚中...",
    done: "完成",
    failed: "失败",
  },

  // ── 日志弹窗 ─────────────────────────────────────────────
  log: {
    title: "同步日志",
    all: "全部",
    info: "信息",
    warnings: "警告",
    errors: "错误",
    clear: "清除",
    clearAll: "清除所有日志",
    stats: "共 {{total}} 条 | {{info}} 条信息，{{warns}} 条警告，{{errors}} 条错误",
    noEntries: "暂无日志。",
  },

  // ── 工具函数 ─────────────────────────────────────────────
  utils: {
    justNow: "刚刚",
    minutesAgo: "{{n}} 分钟前",
    hoursAgo: "{{n}} 小时前",
    yesterday: "昨天",
    daysAgo: "{{n}} 天前",
    untitled: "无标题",
  },

  // ── 同步消息（推送/拉取服务的日志和通知）──────────────────
  sync: {
    startingFullVaultSync: "开始全量同步",
    startingFullVaultSyncNotice: "开始全量同步...",
    syncAborted: "用户中止同步",
    syncingProgress: "同步中... {{i}}/{{total}}",
    syncingReport: "同步 {{i}}/{{total}}...",
    fullSyncComplete: "全量同步完成：已同步 {{synced}} 个，{{errors}} 个错误",
    syncCompleteNotice: "同步完成：已同步 {{synced}} 个文件，{{errors}} 个错误",
    fullSyncFailed: "全量同步失败：{{error}}",
    syncFailedNotice: "同步失败：{{error}}",
    failedToSync: "同步失败：{{error}}",
    startingIncrementalSync: "开始增量同步",
    incrementalSyncComplete: "增量同步：已更新 {{synced}} 个，{{errors}} 个错误",
    incrementalSyncNotice: "增量同步：已更新 {{synced}} 个，{{errors}} 个错误",
    incrementalSyncFailed: "增量同步失败：{{error}}",
    syncedFile: "已同步：{{name}}",
    updated: "已更新：{{path}}",
    pageMissingRecreating: "Notion 页面丢失或已归档——重新创建：{{path}}",
    created: "已创建：{{path}}",
    resolvingLinks: "解析内部链接...",
    linkResolutionFailed: "链接解析失败：{{error}}",
    removedMapping: "已移除已删除文件的映射：{{path}}",
    startingPull: "开始从 Notion 拉取",
    pullingNotice: "正在从 Notion 拉取...",
    pullingProgress: "拉取中 {{i}}/{{total}}...",
    pullComplete: "拉取完成：已更新 {{pulled}} 个，{{errors}} 个错误",
    pullFailed: "拉取失败：{{error}}",
    pulledFile: "已从 Notion 拉取：{{path}}",
    rebuildingHierarchy: "重建 Notion 层级结构",
    rebuildingHierarchyNotice: "重建层级结构中... 可能需要一些时间。",
    syncAlreadyInProgress: "同步已在进行中",
    configureTokenFirst: "请先在设置中配置 Notion API 令牌",
    configureRootPageFirst: "请先在设置中配置根页面 ID",
    startingPullNewPages: "开始从 Notion 拉取新页面",
    pullingNewPagesNotice: "正在从 Notion 拉取新页面...",
    attachmentNotFound: "附件未找到：{{name}}",
    fileNotFoundInVault: "在知识库中未找到文件",
    unsupportedEmbedType: "不支持的嵌入类型：.{{ext}}",
    uploadFailed: "上传失败",
    configureUploadUrlForImages: "请在设置中配置附件上传地址以同步图片",
    configureUploadUrlForPdfs: "请配置上传地址以同步 PDF 嵌入",
  },
} satisfies DeepStringRecord;

export default zh;
