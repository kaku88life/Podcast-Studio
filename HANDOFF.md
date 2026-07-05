# HANDOFF — Podcast-Studio

> 工程快照，只留最新狀態＋下一步。敘事進 Obsidian，待辦細節見 `docs/distill/03-真backlog.md`。
> 最後更新：2026-07-05（Session 2：蒸餾）
> 注意：`feat/production-hub` 分支上有 Session 1 的舊版 HANDOFF.md，merge PR #1 時**以 main 這份為準**（衝突時保留本檔、丟棄分支版）。

## 一句話總結
完成「蒸餾」：把散在 repo 兩分支／Obsidian／life-os BACKLOG 的所有規劃收斂成四份文件（現況真相／目標 spec／真 backlog／一頁總結），這輪只讀不寫功能碼；下輪照 backlog P0 開始執行。

## 完成到哪
- **四份蒸餾文件**（`docs/distill/`，本輪唯一產出）：
  - `00-一頁總結.md` — 接下來三步＋哪步便宜模型就夠
  - `01-現況真相.md` — 做出來的（三面板+Supabase+Drive）vs 純規劃的（整條產線）；main vs feat 分支差異
  - `02-目標spec與願景.md` — 捕捉→腳本→配音(ElevenLabs)→影片(Remotion) 四棒 pipeline＋四閘門＋使用者故事＋合規 spec
  - `03-真backlog.md` — P0–P3 去重排序，每條標 💚便宜模型OK／🔶需Opus／🧍非模型
- **證據核實**：BACKLOG M1–M4、production-hub-plan 11 問題、Obsidian 全部引用皆獨立驗證吻合
- **Obsidian 掃描補漏**（新進 backlog）：6a 確認 2026-06-07 試錄下落；17a 兩份會議逐字稿整理（5/23 京都物件＝現成首集素材）
- 蒸餾由兩場 session 合力：前一場產出四份文件後中斷，本場獨立驗證＋補漏＋收尾

## 下一步從這開始（照 `docs/distill/00-一頁總結.md` 三步走）
1. **跑掉樞紐（人力）**：Hiro 簽聲音克隆**書面同意書** → 兩人各錄 3–5 分鐘語料 → ElevenLabs 建模試聽（聲音品質＝整條線可行性的決定點）
2. **收尾現況（便宜模型就夠）**：Merge PR #1 回 main（記得 HANDOFF 衝突以 main 為準）、Drive 收尾（拖 PNG／跑 GAS／分享 Hiro 編輯權）、對齊 11 個待確認問題、確認 6/7 試錄下落、整理兩份會議逐字稿
3. **搭 MVP 骨幹**：M1 捕捉複用 → M2 腳本化＋覆核介面 → M3 ElevenLabs 串接 → M4 Remotion 模板；唯一需 Opus 的是**首集腳本語感校準**，其餘可交便宜模型

## 已知問題與假資料待補
- **PR #1（feat/production-hub）仍未 merge**；分支含三面板＋Supabase＋Drive 成果（+11 檔/1880 行）
- 分支版 HANDOFF 誤記「最後一批待補 commit」——實際已在 `df57d64` 收進，只差 merge
- Session 1 遺留：Drive 亂碼 SVG 未刪、PNG 未拖入、GAS `drive-setup.gs` 未實跑、資料夾未分享 Hiro
- 聲音克隆目前**只有口頭同意，無書面**；面板無「克隆授權狀態」欄位（backlog 已列）
- 2026-06-07 試錄是否進行過：**未知**，待 Master 確認

## 驗證命令
- 蒸餾文件：直接讀 `docs/distill/` 四份（純 markdown，無 build）
- 面板（分支上）：一般瀏覽器開 `docs/board.html` 等，右上「● 即時同步中」＝後端 OK（Claude 內建預覽會顯示離線，屬正常）
- 分支差異：`git diff --stat main...feat/production-hub`

## 信心最低的產出與原因
- **03-真backlog 的「可否交便宜模型」標記**：屬判斷非事實，實際派工時可能發現某些串接（如 ElevenLabs timestamps 對齊）比預期難，需上調模型
- **6a 試錄下落**：Obsidian 只有會議決議、無後續記錄，「沒錄」只是推測
- 01 引用的 tools-catalog「116 選項」數字：轉引自 Session 1 記錄，本輪未重數

## 本次模型與 effort
claude-opus-4-8（session 開頭曾下 `/model claude-fable-5`，實際回覆由 claude-opus-4-8 產生；effort 詳值待 Master 到 usage 儀表板確認）。子代理 2 隻（Explore：Obsidian 全掃／BACKLOG+分支文件摘錄）。

## 偏好提醒
- 給人看的產出要**好懂、視覺化，不要 AI 風格**（大表格/術語/JSON）——memory `presentation-style`
- 回覆開頭稱「Master」、繁體中文、程式碼註解英文、不用 emoji（程式碼內）
- 工具選擇**保持中立**（資源蒐集階段，兩人試完自己拍板）
- 聲音克隆紅線：**書面同意＋平台 AI 揭露＋只做真實討論過的內容**
- 學弟＝Hiro（hiro.nango@ado-ro.com）；Drive 家＝Hiro 共用資料夾「Podcast (Adoro x Kaku)」

## 在哪開新 session（環境）
Windows 原生（文件/面板/Drive/GAS 類專案）。專案根 `C:\vibe coding\Podcast-Studio`，GitHub origin: kaku88life/Podcast-Studio。

## Kickoff Prompt
> 延續 Podcast-Studio（日本不動產知識型 Podcast，兩人：Master + 學弟 Hiro，AI 語音克隆＋視覺生成，不出鏡）。上輪已完成「蒸餾」：讀 `docs/distill/00-一頁總結.md`（三步走）與 `03-真backlog.md`（P0–P3，每條標可否交便宜模型）。現況：管理中心 MVP 在 feat/production-hub 分支（PR #1 未 merge），內容產線（腳本化→ElevenLabs 配音→Remotion 影片）尚無程式碼。今天想做：（擇一）① Merge PR #1＋Drive 收尾等 P1.5 清單；② 開始 M1 捕捉層複用（接 line-inspiration-helper）；③ 幫我準備 Hiro 聲音克隆書面同意書草稿＋ElevenLabs 試聽流程。紅線：聲音克隆需書面同意＋平台 AI 揭露；工具選擇保持中立；給人看的東西走好懂視覺化風格。
