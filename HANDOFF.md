# HANDOFF — Podcast-Studio

> 工程快照，只留最新狀態＋下一步。敘事進 Obsidian，待辦細節見本檔與 docs/。
> 最後更新：2026-06-17（Session 1）

## 一句話總結
把 Podcast 內容工廠從「架構規劃」推進到「可用的製作管理中心 MVP」——三個即時共編面板 + Supabase 後端 + Google Drive 檔案結構都到位；工具選型刻意保持未決定（資源蒐集階段）。

## 完成到哪
- **架構/提案文件**：`docs/workflow-integrated.md`（A–G 環節串接）、`docs/production-hub-plan.md`（製作管理中心提案，含 11 個待確認問題）
- **三個面板**（單檔 HTML + Supabase 即時共編，RWD，三頁導覽互通）：
  - `docs/board.html` 節目看板（8 段狀態、新增/編輯/移動/封存）
  - `docs/tools-checklist.html` 工具確認表（7 環節 116 選項，雙人各自評分，中立不排名）
  - `docs/prep-checklist.html` 資源準備清單（勾選/分工/進度/分享連結）
- **Supabase**：專案 `podcast-studio`（ref `uwowizckfmekyobnzykv`，東京，免費）；三表 `prep_items` / `tool_reviews` / `episodes`，皆 Realtime + hardened RLS；REST 匿名寫入/讀取實測通過、security advisor 0 警告
- **Google Drive**：家＝團隊現有共用資料夾「Podcast (Adoro x Kaku)」（Hiro 持有）。已建 A–G 三層結構 + EP000 範本 + EP001 + 會議記錄範本 + README；資料夾 IDs 在 `docs/data/drive-folders.json`；整理/新增一集用 `docs/data/drive-setup.gs`
- **製作流程圖**：`docs/assets/podcast-flow.png`（白話版，已傳給 Master）
- **Git**：PR #1 已開（分支 `feat/production-hub`）。最後一批檔案（drive map / GAS / flow / nav）**待補 commit**（本次 Bash 安全分類器暫時無法用）

## 下一步從這開始
1. **補 commit** 最後一批變更（Bash 恢復後）：`docs/data/*`、`docs/assets/*`、prep/tools 兩頁 nav 更新
2. **Drive 收尾**（Master/Hiro 手動或跑 GAS）：把 PNG 拖進 Drive、刪掉亂碼 SVG、`organizeFirstEpisode` 把現有 5 檔歸位、`cleanupOldPersonalHub` 清掉 kaku 個人 Drive 的空 `PodcastStudio`、**把資料夾分享給 Hiro 當編輯者**
3. 和 Hiro 對齊 `production-hub-plan.md` 的 11 個待確認問題；開始用「工具確認表」試工具
4. **Phase 2**：會議模組（寄信 + 行事曆三件組）、PWA 化（manifest + service worker + 圖示）

## 已知問題與假資料待補
- Drive 上的「Podcast 製作流程圖」**SVG 中文亂碼**（Google 預覽伺服器無中文字型）→ 需換成 PNG；Drive MCP 無法直接上傳大圖，需手動拖入
- **Drive MCP 只能建立、不能搬移/刪除** → 現有 5 檔歸位與清理只能靠 GAS 或手動
- `drive-setup.gs` 的檔案歸位對應是**建議值**（Episode 1 簡報放 A_企劃 為猜測），需 Master 確認；moveFolder 移動他人持有檔案可能因權限失敗（已 try/catch），未實跑驗證
- 面板嵌 publishable key（client-side 設計可公開、RLS 保護）；repo 若設 public 需知悉
- 面板即時同步在 Claude Code 內建預覽會顯示「離線」（沙箱擋外連），**要用一般瀏覽器開**才會同步
- 工具選型**全部「待測試、未決定」**（刻意，資源蒐集階段）

## 驗證命令
- 面板：瀏覽器開 `docs/board.html` / `docs/tools-checklist.html` / `docs/prep-checklist.html`，右上顯示「● 即時同步中」即後端 OK（內建預覽會顯示離線，屬正常）
- Supabase：REST 匿名 upsert/select 已測（201/200）；`get_advisors security` = 0 lints
- 無 build（純靜態單檔 HTML）

## 信心最低的產出與原因
- **會議自動化 / PWA**：尚未實作，只在提案 → Phase 2 才驗證
- **GAS drive-setup.gs**：未實跑，移動他人持有檔案的權限行為未驗證
- **Drive 檔案歸位對應**：憑檔名猜測，需 Master 確認 Episode 1 簡報等該放哪

## 本次模型與 effort
claude-opus-4-8；ultracode 模式（多代理 Workflow + 高 effort）。

## 偏好提醒
- **給人看的產出要「好懂、視覺化」，不要 AI 風格**（大表格 / 術語 / ── 分隔線 / JSON）——見 memory `presentation-style`
- 回覆開頭稱「Master」、繁體中文、程式碼註解英文、不用 emoji
- 工具選擇**保持中立、不替 Master 決定**（資源蒐集階段）
- 學弟＝Hiro（hiro.nango@ado-ro.com，ado-ro.com 網域）；kaku 個人帳號未開 Workspace

## 在哪開新 session（環境）
Windows 原生（本專案屬文件/面板/Drive/GAS 類，非部署 Linux）。專案根 `C:\vibe coding\Podcast-Studio`，已連 GitHub（origin: kaku88life/Podcast-Studio）。

## Kickoff Prompt
> 延續 Podcast-Studio（日本不動產知識型 Podcast，兩人：Master + 學弟 Hiro，用 AI 語音克隆＋視覺生成降低出鏡與卡詞成本）。已完成製作管理中心 MVP：三個即時共編面板（board/tools-checklist/prep-checklist，單檔 HTML + Supabase）、Supabase 後端三表、Google Drive A–G 結構（建在 Hiro 共用資料夾）。讀 `HANDOFF.md`、`docs/production-hub-plan.md`。今天想做：先補 commit 最後一批變更；然後（擇一）幫我把 Drive 現有檔案歸位/清理、或做 Phase 2 的會議模組、或 PWA 化。給人看的東西記得走「好懂視覺化」風格、工具選擇保持中立。
