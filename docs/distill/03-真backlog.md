# 蒸餾 03 — 真 Backlog（去重＋依價值排序）

> 產出日期：2026-07-05｜把 life-os BACKLOG M1-M4、Podcast-Studio HANDOFF、workflow M1-M6、production-hub Phase 1/2/3、Obsidian 待決事項全部併攏、去重、依「解鎖端到端 MVP 的價值」排序。

**「可否交便宜模型」欄位定義：**
- 💚 **便宜模型OK**：Haiku/Sonnet 或便宜 coding agent 足夠（機械性、樣板、串接、整理）。
- 🔶 **需 Opus**：要高品質語感判斷或架構校準（首集腳本、紅線把關）。
- 🧍 **非模型工作**：人/手動/法務/API 帳號設定（模型幫不上主要忙）。

---

## P0 — 解鎖一切的前置（大多是人與決策，便宜且卡關）

| # | 項目 | 為何 P0 | 可否便宜模型 | 來源 |
|---|---|---|---|---|
| 1 | **Hiro 聲音克隆書面同意書** | 配音棒的法律前置，沒簽不能啟動 M3；目前只有口頭 | 🧍 非模型（法務/人） | life-os BACKLOG L29、workflow-architecture 合規節 |
| 2 | **ElevenLabs 中文克隆試聽**（兩人各錄 3–5 分鐘乾淨語料 → 建模 → 試聽） | 全案決策樞紐：聲音品質過不過關決定整條線可行性 | 🧍 非模型（錄音＋API 操作；Master/Hiro） | life-os M3、workflow-architecture MVP、Obsidian Session筆記 |
| 3 | **和 Hiro 對齊 production-hub-plan 的 11 個待確認問題** | 解鎖後續所有製作決策 | 🧍 非模型（兩人會議） | production-hub-plan.md、HANDOFF 下一步 |
| 4 | **頻道命名＋定位敲定** | 影響封面/品牌/所有視覺；目前「好日本看房」等都覺得吸力不強 | 🧍 人拍板（模型可提案發想 💚） | Meetings 2026-05-29、Wiki 10_問題收集 |
| 5 | **前四集物件清單**（Hiro 準備想介紹的物件＋評估標準） | 沒題目就沒內容；第一集亮點暫定「小套房投資陷阱」 | 🧍 非模型（Hiro 準備） | Meetings 2026-05-29 |
| 6 | **虛擬形象策略決定**（純簡報式 vs avatar） | 決定 D 視覺環節走向；文件傾向「MVP 先純簡報式跑通」 | 🧍 人拍板 | Meetings 2026-05-29、workflow-integrated D8 |
| 6a | **確認 2026-06-07 試錄下落**（錄了沒？音檔在哪？） | 會議決議要試錄但無後續記錄；若有音檔＝M1 捕捉層第一份真實測試素材 | 🧍 人確認 | Meetings 2026-05-29 決議（本輪 Obsidian 掃描補入） |

---

## P1 — MVP 端到端骨幹（跑通第一集）

| # | 項目 | 對應 | 可否便宜模型 | 來源 |
|---|---|---|---|---|
| 7 | **M1 捕捉複用**：接 line-inspiration-helper 轉錄/字幕成「捕捉層」 | 棒 1 | 💚 便宜（多為串接/glue code） | life-os M1、workflow-architecture M1 |
| 8 | **M2 腳本化 LLM 呼叫**（逐字稿→結構化對話，守「不創造」紅線） | 棒 2 | 🔶 **首集需 Opus 校準**，之後 Sonnet 量產 | life-os M2、workflow-integrated B/D5/D6 |
| 9 | **M2 腳本覆核編輯介面**（逐行 approve/reject/改） | 棒 2 | 💚 便宜（前端 CRUD＋狀態） | workflow-architecture M2 |
| 10 | **M3 ElevenLabs TTS 串接**（腳本→雙聲音音檔＋字級時間碼） | 棒 3 | 💚 便宜（API 串接）；前置＝#1 同意書 | life-os M3、workflow-integrated C |
| 11 | **M4 Remotion 簡報影片模板**（音＋字幕＋圖表，以 cue_id 綁句自動排版） | 棒 4 | 💚 便宜（樣板化，需 1–2 次校準迭代） | life-os M4、workflow-architecture M4 |
| 12 | **AI 揭露落地**（發佈前強制勾＋描述模板） | 棒 4/F | 💚 便宜（checklist＋表單邏輯） | production-hub-plan L178、workflow-integrated D15 |
| 13 | **Episode DB 起步**（沿用 Supabase `episodes` 表：狀態正規化＋環節 JSONB） | 棒 G | 💚 便宜（schema＋CRUD） | workflow-integrated D17、Supabase memory |

---

## P1.5 — 現有成果收尾（低成本、清掉技術債）

| # | 項目 | 可否便宜模型 | 來源 |
|---|---|---|---|
| 14 | **Merge PR #1**（feat/production-hub → main；HANDOFF 誤記「待補 commit」實則已 commit） | 💚 便宜（git 操作） | HANDOFF L18；本次分支檢查 |
| 15 | **Drive 收尾**：拖 PNG 進 Drive、刪亂碼 SVG、跑/驗 `organizeFirstEpisode`、清 `cleanupOldPersonalHub`、**把資料夾分享給 Hiro 當編輯者** | 🧍 非模型（手動/GAS） | HANDOFF 下一步、drive-setup.gs |
| 16 | **驗證 drive-setup.gs**（移動他人持有檔案的權限行為未實跑；歸位對應憑檔名猜測需 Master 確認） | 🧍 人＋💚 便宜（改腳本） | HANDOFF 已知問題 |
| 17 | **工具確認表試用迴圈**（兩人實際試工具、填評分、拍板各環節選型） | 🧍 非模型（兩人試用） | production-hub-plan、HANDOFF |
| 17a | **兩份會議逐字稿整理**（2026-05-23 京都物件、2026-05-29 需求會議）：專有名詞確認＋wiki 化；京都物件內容（公設比換算、單坪比較、具體案例）可直接餵首集企劃素材 | 💚 便宜模型出整理草稿＋🧍 人確認專有名詞 | Meetings/（本輪 Obsidian 掃描補入） |

---

## P2 — 產能放大（MVP 之後）

| # | 項目 | 對應 | 可否便宜模型 | 來源 |
|---|---|---|---|---|
| 18 | **M5 多平台轉化**（一份 master → Shorts/音檔/blog/社群；先用 Vizard 建品質基準） | F | 💚 便宜（串接＋樣板文案 Sonnet） | workflow-architecture M5、D12/D13 |
| 19 | **M6 發佈與素材庫**（多平台排程 Postiz＋Podcast 自架 RSS＋資產版本/血緣） | F/G | 💚 便宜（串接/排程） | workflow-architecture M6、D14 |
| 20 | **Phase 2：會議模組**（寄信＋行事曆三件組） | 周邊 | 💚 便宜（GAS/串接） | production-hub-plan Phase 2、HANDOFF |
| 21 | **Phase 2：PWA 化**（manifest＋service worker＋圖示） | 周邊 | 💚 便宜（前端樣板） | production-hub-plan Phase 2 |
| 22 | **數據圖表流程**（LLM 抽草稿＋人工逐項驗出處；配圖 Nano Banana Pro＋Flux 氛圍） | D | 💚 便宜（抽草稿）＋🧍 人驗證出處 | workflow-integrated D9/D10 |
| 23 | **日本官方資料源接入**（MLIT/e-Stat/地価公示；先 AI 抓＋翻＋人覆核，穩定後定期同步） | D | 💚 便宜（抓取/翻譯 Sonnet）＋🧍 覆核 | workflow-integrated D19 |

---

## P3 — 進階/可選（明確標為未來）

| # | 項目 | 可否便宜模型 | 來源 |
|---|---|---|---|
| 24 | **波形編輯器 Stage 1**（單軌波形＋非破壞性刪除＋「對字幕版/成品版」雙匯出，解協作對字幕痛點） | 💚 便宜（前端 Canvas/Web Audio） | Sources 波形編輯器架構 |
| 25 | **波形編輯器 Stage 2–4**（多軌對齊/時間軸剪輯/AI 影音剪輯） | 💚 便宜（分階段） | 同上 |
| 26 | **虛擬主播評估**（HeyGen/D-ID，MVP 後再評） | 🧍 人評估＋💚 試接 | workflow-integrated D8、tools-catalog D |
| 27 | **Phase 3：總覽 Dashboard＋會議全自動＋TS+Tailwind 正式重構** | 💚 便宜（重構/前端） | production-hub-plan Phase 3 |
| 28 | **對外產品進度卡**（未來私有面板上以卡片呈現 podcast 進度） | 💚 便宜 | life-os BACKLOG L11 |

---

## 便宜模型可承接比例（快覽）

- **P0 幾乎全是人/法務/決策**（🧍）——模型主要能幫的是 #4 命名發想。這一層便宜模型也省不了，因為卡在「人要做決定」。
- **P1 骨幹大多 💚 便宜可承接**，唯一真正要 Opus 的是 **#8 首集腳本校準**（守口語風＋不創造觀點的紅線），校準完之後量產可降到 Sonnet。
- **P2/P3 幾乎全 💚**：串接、樣板、前端、排程，都適合交便宜的 coding agent，人只在「數據出處驗證」與「工具拍板」上把關。

> 一句話：**真正需要貴模型的只有「首集腳本的語感校準」；其餘要嘛是人的決定，要嘛便宜模型就夠。**
