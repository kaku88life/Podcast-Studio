# Podcast 製作管理中心 — 規劃提案（可對齊版）

> 對象：兩位主持人（你 + 學弟）｜主題：日本不動產知識型 Podcast｜文件日期：2026-06-17
> 性質：**這是給你們兩人「對齊用」的計劃，不是替你們選工具的決策書。**
> 對齊既有文件：`docs/workflow-architecture.md`、`docs/workflow-integrated.md`（A–G 七環節）、`docs/prep-checklist.html`（已接 Supabase）。

---

## 0. 先把你們的想法用我的話重講一遍（確認沒理解錯）

我把你這次的需求拆成六個重點，先複述確認：

1. **現在是「資源蒐集階段」，不是「定案階段」。** 每個環節（錄音、轉錄、腳本 LLM、語音克隆、視覺、剪輯、發佈）要用哪個工具，**都還沒決定**。所以系統的第一要務是「**把所有可選工具中立列出來**」，不替你們挑、不標「推薦/最佳」，讓你們**試用 → 評分 → 自己決定**。
2. **要從「一張勾選清單」升級成「正式節目團隊的製作進度管理系統」**——像真正的 YouTuber／節目團隊那樣，管理每一集（Episode）的進度、資源準備、檔案位置、會議。
3. **會議記錄與資料統一放 Google Drive**，而且要白紙黑字寫清楚「什麼東西放哪、之後怎麼利用與共享」，不要讓 Drive 變黑洞。
4. **會議一確定，系統要能自動寄信到你們兩人 Gmail，並建議加入 Google 行事曆**，讓面板真正變成「專案管理系統」。
5. **手機要好用**：做成 PWA / RWD，電腦跟手機都順手。
6. （隱含）**技術上沿用現有單檔 HTML + Supabase**，能即時共編，先把架構跑順，未來再升級成 TypeScript + Tailwind 正式 PWA。

> 一句話定調：**先把「決策輔助」做好（工具確認表），再把「製作管理」立起來（看板＋檔案＋會議），全程兩人即時共編、手機可用。工具由你們試完自己拍板。**

---

## 1. 系統定位與資訊架構（IA）

### 定位
一個 **PWA / RWD 的「節目製作中心」**：桌機左側導覽、手機底部 Tab Bar。資料層延用 Supabase（Realtime 即時共編 + RLS），**檔案實體全部住 Google Drive，面板只存「連結 + 狀態」**，排程事件觸發 Gmail / Google 行事曆。

### 六大模組（分頁）

| # | 模組 | 一句話定位 | 放什麼 |
|---|---|---|---|
| **0** | 總覽 Dashboard | 一打開先看到「現在最該做什麼」 | 我的待辦、本週死線紅黃綠燈、庫存燈號（已排程存貨幾集）、下次會議卡片、管線漏斗小圖 |
| **1** | 節目看板 Board | 每集的生命週期管理（**核心**） | 8 段狀態看板（可往回拖）+ 內容行事曆視圖 + 集數詳情頁 |
| **2** | 工具確認表 Tools | **中立列出每環節所有可選工具，可試用可評分**（你的最重要需求） | 一環節一張表、雙人各自評分、傾向欄（待定/候選/淘汰） |
| **3** | 資源準備清單 Prep | 現有 `prep-checklist` 升級 | 跨集共用資源（帳號/API key/品牌素材）+ 單集準備項 |
| **4** | 檔案地圖 File Map | 講清楚「什麼放哪、怎麼共享」 | Drive 資料夾地圖、命名規範、權限層級、快速直達連結 |
| **5** | 會議與行事曆 Meetings | 會議記錄 + 下次會議自動通知 | 會議三件套（決議/待辦/下次會議）、自動寄信 + 加行事曆 |

> 手機底部 Tab 放最常用 4 個（**總覽 / 看板 / 工具 / 會議**），其餘收進「更多」。

---

## 2. 「工具確認表」設計（你的核心需求，嚴格保持中立）

### 2.1 確認表長什麼樣

**設計鐵則**：以「環節」分組；每個環節列出**所有候選工具**；**不標「推薦/最佳/排名」**，只給客觀規格；評分欄是「**試用後**」才填，且**雙人各自評分**並排對照。

每個工具一張卡，欄位分兩段：

**A. 客觀規格欄（事先填好，中立描述）**
| 欄位 | 說明 |
|---|---|
| 工具名稱 / 連結 | 官網 |
| 類型 | 硬體 / SaaS / API / 開源自架 |
| 收費模式 | 免費 / 訂閱 / 用量計費（中立填，不評「貴不貴」） |
| 繁中支援 | 介面/輸出是否支援繁中 |
| 商用授權 | 產出可否商用、AI 聲音/圖像授權條款 |
| API/自動化 | 有無公開 API、可否串既有流程 |
| 試用方式 | 免費額度 / 試用門檻 |

**B. 試用後評分欄（試完才填，雙人各自一份）**
| 欄位 | 說明 |
|---|---|
| 試用狀態 | 未試 / 試用中 / 已試 |
| 評分（1–5★） | 品質 / 易用 / 成本 / 整合性，**你跟學弟各打一份** |
| 試用筆記 | 各自心得 |
| **目前傾向** | 待定 / 候選 / 淘汰（**注意：是「傾向」不是「決定」**） |

> 資料表：`tools`（基本資料）+ `tool_reviews`（tool_id, reviewer, score_quality, score_ease, score_cost, score_integration, note, tried_status）。評分天然支援兩人共編 + 差異對照。

### 2.2 各環節選項彙整表（全部標注「待測試，未決定」）

下面把研究的中立列舉收斂成「一環節一張表」。**所有欄位皆為客觀規格，傾向一律 = 待測試。**

#### 環節 A-1｜錄音硬體（麥克風 / 介面）

| 工具 | 類型 | 成本（一次性） | 重點規格（中立） | 傾向 |
|---|---|---|---|---|
| 動圈麥（SM7B / MV7+ / PodMic(USB) / Q2U / ATR2100x） | 硬體-麥克風 | NT$2,500–13,000 | 抗噪抗回音強，適合未做音響處理房間；部分 USB+XLR 雙模 | 待測試 |
| 電容麥（AT2020 USB-X / NT-USB+ / NT1 / Yeti / Wave） | 硬體-麥克風 | NT$3,500–8,000 | 細節臨場感佳，但同收雜訊，需安靜房間 | 待測試 |
| 領夾/無線（DJI Mic 3/Mini / Rode Wireless / Hollyland / Saramonic） | 硬體-麥克風 | NT$4,500–13,000 | 每人一支天生分軌；AI 降噪過強可能吃氣音；純語音 Podcast 多不需 | 待測試 |
| 錄音介面/混音座（Scarlett 2i2 / Vocaster Two / RodeCaster Duo/Pro2 / Zoom PodTrak P4 / M-Track Duo） | 硬體-介面 | NT$2,800–22,000 | **分軌關鍵硬體**；RodeCaster/PodTrak 每軌獨立輸出，最符合「兩人各一軌」 | 待測試 |

#### 環節 A-2｜錄音軟體與遠端方案

| 工具 | 類型 | 成本 | 重點規格（中立） | 傾向 |
|---|---|---|---|---|
| 同地單機分軌（OBS / Audition 多軌錄） | 方案 | OBS 免費 | 兩麥接同一介面各錄一軌，speaker 由軌別定，免 diarization | 待測試 |
| Riverside | 遠端 SaaS | 免費起，付費 US$15–24/月 | 裝置端本地錄製、最高 4K、分軌、內建 AI 字幕 | 待測試 |
| Zencastr | 遠端 SaaS | 免費起，US$15–20/月 | 本地分軌高音質、錄到發佈一條龍 | 待測試 |
| SquadCast（整合於 Descript） | 遠端 SaaS | 含於 Descript（US$12/月起） | 漸進上傳、Dolby 處理、無縫進 Descript 文字化剪輯 | 待測試 |
| Audacity | 本地開源 | 免費 | 老牌多軌、可離線、不含轉錄 | 待測試 |
| OBS Studio | 本地開源 | 免費 | 分軌錄多麥 + 錄畫面，最契合本案輸入 | 待測試 |
| Adobe Audition | 本地訂閱 | 含於 CC | 專業修復、最多 32 軌 | 待測試 |
| Descript | 錄音+編輯 SaaS | US$12/月起 | 編輯逐字稿即編輯音檔、內建轉錄 | 待測試 |

#### 環節 A-3｜轉錄與字幕

| 工具 | 類型 | 成本 | 重點規格（中立） | 傾向 |
|---|---|---|---|---|
| 既有 line-inspiration-helper 雙軌流程（whisper-1） | 既有 API 資產 | ~US$0.006/分 | **幾乎零開發**，已串 /api/captions + SRT/VTT，已設計日不動產詞庫 | 待測試 |
| OpenAI Whisper 開源自架（large-v3 / turbo / faster-whisper） | 開源自架 | 免費+算力 | 可完全本地、資料不離境；需 prompt 引導繁體 | 待測試 |
| OpenAI 雲端（whisper-1 / gpt-4o-transcribe） | 雲端 API | whisper-1 US$0.006/分 | 串接最直接、與既有同源 | 待測試 |
| Google Cloud STT（Chirp/v2） | 雲端 API | ~US$0.004–0.006/15秒 | 支援 zh-TW、自訂詞表強化專有名詞 | 待測試 |
| Azure AI Speech | 雲端 API | 同級 | zh-TW、Custom Speech 自訂詞彙 | 待測試 |
| AssemblyAI / Deepgram | 雲端 API | US$0.0043/分起 | 內建語音理解/低延遲 | 待測試 |
| ElevenLabs Scribe | 雲端 API | 含於訂閱 | 與其語音克隆同生態 | 待測試 |
| 雅婷逐字稿（台灣 AILabs） | 台灣 SaaS | 免費送 300 分 | **專為台灣口音、資料不離開台灣**、支援晶晶體 | 待測試 |
| Good Tape | 雲端 SaaS | 免費+訂閱 | Whisper 改良、台灣記者圈愛用 | 待測試 |
| 裝置端內建聽寫 | 裝置端 | 免費 | 離線隱私佳，但無分軌/詞庫，當備援 | 待測試 |

#### 環節 B｜腳本整理 LLM

| 工具 | 類型 | 成本（API/百萬 token 或月費） | 重點規格（中立） | 傾向 |
|---|---|---|---|---|
| Claude Opus 4.8 | SaaS/API | 輸入$5/輸出$25 | 繁中語感自然、原生 tool use；Pro 約 $17/月 | 待測試 |
| Claude Sonnet 4.6 | SaaS/API | $3/$15 | 1M 上下文、品質成本折衷 | 待測試 |
| Claude Haiku 4.5 | SaaS/API | $1/$5 | 最快最便宜，適合粗整理 | 待測試 |
| OpenAI GPT-5.5 | SaaS/API | $5/$30 | 全能、需 prompt 指定台灣繁中；Structured Outputs 成熟 | 待測試 |
| GPT-5.4 / mini / nano | API | $2.5/$15 ~ $0.2/$1.25 | 性價比線，量大後端任務 | 待測試 |
| Gemini 3.5 Flash | SaaS/API | $1.5/$9 | 1M 上下文、在地詞理解佳、台灣化用詞需指定 | 待測試 |
| Gemini 3.x Pro | SaaS/API | 高於 Flash | 較強理解、長文整理 | 待測試 |
| Claude.ai / ChatGPT Projects、NotebookLM、Notion AI、Descript | 現成介面 | 月費制 | **學弟不需寫程式**即可操作；NotebookLM 與你們 Drive 整合順 | 待測試 |
| Llama 4 / Qwen 3.x / DeepSeek V4 + Ollama / LM Studio | 開源自架 | 免費+GPU | 資料不外流、隱私最高；台灣繁中需 prompt 工程 | 待測試 |

#### 環節 C｜語音克隆與雙人對話 TTS

| 工具 | 類型 | 成本 | 重點規格（中立） | 傾向 |
|---|---|---|---|---|
| ElevenLabs（v3 + Text to Dialogue） | SaaS+API | $5–$330/月 | **原生多人對話模式**、字元級 timestamps、即時/專業克隆 | 待測試 |
| Fish Audio | SaaS+API | $5.5–37.5/月 | 主打亞洲語言、中英日混排佳、15 秒克隆 | 待測試 |
| MiniMax（海螺 Speech 2.5/2.6） | SaaS+API | ~$0.04–0.05/1K字元 | 官方稱中文最強；對話需分段串接 | 待測試 |
| 火山引擎/豆包語音 | SaaS+API | 音色 ~150 RMB/年 | 5–10 秒極速復刻、指令式情緒；需中國雲帳號 | 待測試 |
| PlayHT / PlayDialog | SaaS+API | $15–100/百萬字元 | 專為多人對話、10 秒克隆 | 待測試 |
| OpenAI TTS | API | ~$15/百萬字元 | **非任意克隆**（固定音色+風格指令） | 待測試 |
| Azure Custom Neural Voice | 雲平台+API | ~$24/百萬字元 | 企業級、嚴格本人同意審核、合規清楚 | 待測試 |
| Google Chirp 3 HD + Instant Custom Voice | 雲平台+API | $30–60/百萬字元 | 10 秒克隆、word boundary 時間戳 | 待測試 |
| 阿里 Qwen-TTS / CosyVoice（雲端百鍊） | 雲平台+API | 按字元 | 中文/方言/聲調優化、串流低延遲 | 待測試 |
| GPT-SoVITS / CosyVoice 2-3 / IndexTTS2 / 其他開源 | 開源自架 | 免費+GPU | 完全本地、零雲費；CosyVoice 有對話模型、IndexTTS2 可精準控時長對嘴 | 待測試 |

#### 環節 D｜不出鏡視覺生成

| 工具 | 類型 | 成本 | 重點規格（中立） | 傾向 |
|---|---|---|---|---|
| Remotion / Revideo / Motion Canvas | 開源框架(TS) | 免費起 | **程式化、模板化、中文字 100% 不亂碼**；符合你 TS+Tailwind 偏好 | 待測試 |
| After Effects / Canva / CapCut | 動態圖形/拖拉 | 訂閱/免費 | 模板生態完整；Canva/CapCut 學習曲線最低、手機友善 | 待測試 |
| Nano Banana Pro/2（Gemini Image） | AI 配圖 API | ~$0.045–0.24/張 | **中文字渲染準確率高（~94%）**、4K、有正式 API | 待測試 |
| Seedream v5 | AI 配圖 API | 每張數美分 | **中英雙語文字渲染領先**，最適合含繁中圖卡 | 待測試 |
| Midjourney / FLUX / DALL·E / Ideogram / Firefly / Recraft | AI 配圖 | 訂閱/用量 | 美感/向量/英文字各有所長；Firefly 唯一提供商用 indemnity | 待測試 |
| HeyGen / Synthesia / D-ID / Colossyan / VEED / 其他 | 虛擬主播 | $5–149/月 | 自訂角色/中文語音；想要固定虛擬主持人露臉用 | 待測試 |
| Flourish / Datawrapper / Google My Maps / Mapbox+Leaflet | 數據圖表/地圖 | 免費起 | **日本地價/空屋率地圖、利率趨勢**；Datawrapper choropleth 適都道府縣 | 待測試 |
| MLIT / e-Stat / 地価公示 等官方數據源 | 資料來源 | 免費 | 餵給上述圖表工具的原始數據 | 待測試 |
| Unsplash / Pexels / Pixabay / Storyset | 免費圖庫 | 免費可商用 | B-roll、背景、插畫 | 待測試 |

#### 環節 E/F｜組裝與後製

| 工具 | 類型 | 成本 | 重點規格（中立） | 傾向 |
|---|---|---|---|---|
| Remotion | 開源框架(TS) | 免費起（3人以上授權） | **自動化批次最高**、@remotion/captions 逐字高亮、可雲端算繪 | 待測試 |
| CapCut | SaaS | 免費–$24.99/月 | 自動字幕、模板多、直出 9:16；商用/隱私需評估 | 待測試 |
| Adobe Premiere Pro | 訂閱 | $21.99–34.49/月 | 業界標準、內建 AI 字幕、格式齊全 | 待測試 |
| DaVinci Resolve | 免費+買斷 | 免費 / Studio $295 買斷 | 免費版已很完整；v21 有 AI 動畫字幕 | 待測試 |
| Final Cut Pro | 買斷/訂閱 | $299.99 買斷 | 裝置端離線字幕；限 Apple 生態 | 待測試 |
| Descript | SaaS | 免費–$65/月 | 文字導向剪輯、極低學習曲線、適 Podcast | 待測試 |
| Kdenlive / Shotcut / OpenShot | 開源 | 免費 | 跨平台免費；Kdenlive 內建 Whisper 字幕 | 待測試 |
| FFmpeg | 開源 CLI | 免費 | **純自動化/批次燒字幕轉檔**，自動化程度極高 | 待測試 |

#### 環節 G｜多平台轉化與發佈（三類各自選）

| 類別 | 工具 | 成本 | 重點規格（中立） | 傾向 |
|---|---|---|---|---|
| (a) AI 切片 | Vizard / OpusClip / Klap | $14–63/月 | 自動挑亮點、9:16、自動字幕；中文斷句需實測 | 待測試 |
| (a) 切片 DIY | FFmpeg+LLM+Whisper 自建 | 免費+算力 | 完全自訂、無浮水印、無扣點；需自寫 | 待測試 |
| (b) 多平台排程 | Postiz / Ayrshare / Buffer / Metricool / Hootsuite / Publer | 免費–$149/月 | Postiz 開源自架+MCP；Ayrshare 純 API；Buffer 有 MCP | 待測試 |
| (c) Podcast 託管 | Spotify for Creators / Transistor / Buzzsprout / Captivate / 自架 RSS | 免費–$19/月 | Spotify 免費；Transistor API 最完整、無限節目 | 待測試 |
| 合規 | AI 揭露 checklist（非工具） | — | YouTube/TikTok/Meta AI 標籤、EU AI Act 2026/08；建議發佈前加「AI 揭露已標記？」勾選欄 | 必做 |

#### 製作管理平台本身（這套面板最終落腳）

| 工具 | 類型 | 成本 | 重點規格（中立） | 傾向 |
|---|---|---|---|---|
| Notion / ClickUp / Trello / Asana / Airtable / Monday | SaaS PM | 免費–$45/人月 | 現成多視圖+手機 App；Airtable 最貼近你們 Episode 資料模型 | 待測試 |
| Google Workspace（Sheets/Docs/Calendar/Drive + GAS） | Google 生態 | 免費起 | **就是你們要的 Drive/Gmail/Calendar 母體**，GAS 你已熟 | 待測試 |
| 自建 web 面板（HTML+Supabase → TS+Tailwind PWA） | 自架（現路線） | Supabase 免費 | **100% 貼合 A–G、資料在自己手上、自動化天花板最高** | 候選（現行） |

---

## 3. YouTuber 式「節目製作看板」

### 3.1 八段狀態流（對齊 A–G，可往回拖）

| # | 狀態標籤 | 完成定義（DoD） | 對應環節 |
|---|---|---|---|
| 1 | 💡 選題池 | 一句話主題 + 為什麼值得做 | A |
| 2 | 📝 企劃確認 | 大綱、資料來源、賣點確定 | A→B |
| 3 | ✍️ 腳本撰寫 | 逐字稿/分段稿完成、雙人都讀過 | B |
| 4 | 🎙️ 錄製/語音生成 | 人聲或 AI 語音素材產出、品質過關 | C |
| 5 | 🎬 製作/剪輯 | 視覺+剪輯+字幕，產出 master 檔 | D/E |
| 6 | 👀 審核校對 | **另一個人**複審：事實/口誤/版權 | F |
| 7 | 🗓️ 已排程 | 上傳、縮圖標題描述就緒、訂好時間 | G |
| 8 | ✅ 已發佈 | 上線、社群推播、回收數據 | G→回饋 |

**三條業界鐵則**：① 狀態少而互斥（6–8 欄就好）；② 每關都要有 DoD（否則永遠卡「剪輯中」，AI 重生成回圈尤其要界定「過關」）；③ **審核者 ≠ 製作者**（知識型講錯傷信任，交叉複審是最低成本保險）。

### 3.2 Episode 卡片欄位（漸進揭露，不要一次全開）

- **核心識別**：集號、內部標題、對外標題、一句話 Hook、狀態
- **排程**：預計/實際發佈日、各階段內部死線（錄製/剪輯/審核死線回推）
- **分工**：Owner（每集單一）、各環節執行者
- **內容資產**（摺疊區）：腳本/語音/視覺/master/縮圖的 Drive 連結
- **事實與合規**（摺疊區）：資料來源清單、事實查核狀態、版權/AI 授權狀態
- **成效回饋**（摺疊區）：觀看/收聽、留言重點、可延伸點

> 起步只開「核心識別 + 排程 + Owner + 腳本連結 + 成品連結」五類，跑順再加。

### 3.3 內容行事曆 + 兩人 RACI

- **兩視圖並存**：看板答「現在卡哪關、誰該動手」；行事曆答「哪天上片、節奏夠不夠」，疊「發佈日（對外）+ 死線回推（對內）」。
- **節奏建議**：兩人+AI，**從雙週一集起步**，常駐保留 1–2 集「已排程」存貨防斷更。
- **兩人 RACI 重點**：每集單一 Owner；**審核一定交給另一個人**；剪輯建議固定單人（風格一致）。

### 3.4 Supabase 資料表（沿用現有風格新增）
`episodes`（ep_no, title, status, owner, publish_date, drive_folder_url…）、`episode_tasks`（episode_id, stage, assignee, due_date, done）、`episode_assets`（episode_id, stage, asset_type, drive_url, status）。全開 Realtime + RLS，與現有 `prep_items` 同套權限。

---

## 4. 檔案與資訊組織（Google Drive）

### 4.1 總原則
**檔案實體住 Drive；面板只存「連結 + 狀態」，永不搬移、不重傳。** 單一真實來源（single source of truth），改檔不換連結。
**建議用共用雲端硬碟（Shared Drive）**（擁有者是團隊，學弟離開/你換帳號檔案都不消失）——但**需 Google Workspace**；若是免費 @gmail.com 無法建，改用「方案 B：個人 Drive 版」（一人持有主資料夾分享給對方編輯，定期備份 `_FINAL`）。

### 4.2 資料夾結構（三層）
```
📁 PodcastStudio/
├─ 📁 00_ADMIN_營運管理/      (會議記錄/節目規劃/工具評估/法務帳務)
│   └─ Meetings_會議記錄/{年}/ + _Templates/ + _Archive/
├─ 📁 10_SHARED_ASSETS_共用資產/  (品牌/語音模型/音樂/視覺庫/主題知識庫)
└─ 📁 20_EPISODES_每集製作/
    ├─ 📁 EP000_範本_TEMPLATE/   ← 新集整夾複製改名
    └─ 📁 EP001_主題/
        ├─ A_企劃_Plan / B_腳本_Script / C_語音_Voice
        ├─ D_視覺_Visual / E_剪輯_Edit / F_包裝_Package / G_發佈_Publish
```
> 每集資料夾**結構完全一致**，前綴 A–G 直接對應工作流環節與看板狀態。

### 4.3 命名規範與「什麼放哪」
- 檔案格式：`EP集數_類型_描述_版本.副檔名`（例 `EP001_腳本_v2.gdoc` → 定稿 `_FINAL`）。
- 日期一律 `YYYY-MM-DD`；會議記錄用日期開頭（`2026-06-24_EP002腳本審查.gdoc`）。
- **「FINAL 是承諾」**：定稿只留一個 `_FINAL`，要再改回到 `v4`，杜絕「最終版_真的最終_v3」。
- 判斷規則：**「下一集還會用到嗎？」會 → `10_SHARED_ASSETS`；只屬這集 → `20_EPISODES/EPxxx`。**

### 4.4 版本管理
- **Google 原生檔**（腳本/文案/會議）：用內建「版本記錄」命名版本，**不要複製成一堆 v1/v2 檔**，連結永不變。
- **上傳檔**（影音/音檔/圖）：影音建議仍 `v1/v2/FINAL` 並存方便對照，定稿後非 FINAL 移 `_old`。
- 面板永遠連到「資料夾」或「FINAL 檔」，不連 v2。

### 4.5 共享與會議記錄流程
- **權限三級**：內部編輯（兩人 Manager）／外包可編輯（指定資料夾）／對外唯讀（單檔分享，不開整夾公開）。
- **會議 SOP**：建立（複製範本→`日期_主題`）→ 共編記錄 → 整理決議/行動項 → 同步行動項到面板待辦 → 卡片貼 Drive 連結 → 填「下次會議」觸發通知 → 完結後移 `_Archive`（移動不改檔案 ID，面板連結照樣有效）。
- 範本固定欄位：日期/與會者/議程/討論/**決議/行動項[ ]誰·做什麼·期限/下次會議**。

### 4.6 面板如何連結 Drive
面板存 `drive_url + status`，永遠指向 Drive 真實檔（覆蓋同名/原生版本記錄→連結不變→面板零維護）。呈現方式：整集資料夾用「📁開啟」按鈕；Google Doc 可 `iframe` 嵌入 `/preview`；mp4 用 `/file/d/<ID>/preview` 內嵌播放；縮圖用 `thumbnail?id=<ID>` 直接顯示。取得連結先「手動分享貼上」（今天就能用），之後再用 GAS/Drive API 半自動抓回 Supabase。

---

## 5. 會議自動化（會議確定 → Gmail 通知 + 行事曆）

分兩階段，**MVP 先零後端、要全自動時因你熟 GAS 直接跳 GAS**。

### 階段 1：MVP 零後端三件組（本週可上、零成本）
時間一填好，面板就渲染三顆按鈕（全部純前端，塞進現有單檔 HTML）：
1. **`mailto:` / Gmail compose 連結** — 一鍵開草稿（半自動，仍需人按送出）。
2. **Google Calendar 範本連結** — `calendar.google.com/calendar/render?action=TEMPLATE&dates=START/END&ctz=Asia/Tokyo…`，點了跳預填頁按儲存即可（**最該做、最穩的一顆**；注意要做「當地時間→UTC」轉換，`ctz` 只影響顯示）。
3. **`.ics` 下載** — 跨平台（Apple/Outlook/手機）保險；最小 VEVENT 要 `UID/DTSTAMP/DTSTART/DTEND/SUMMARY`，行尾 CRLF；iOS Safari 改用 data URI 較穩。

> 只需 Supabase 新增 `meetings` 表，不動其他結構。

### 階段 2：全自動（四選一，我的傾向：GAS）

| 做法 | 後端 | 寄信 | 行事曆 | 成本 | 何時選 |
|---|---|---|---|---|---|
| **B2 GAS Web App**（傾向） | GAS | 你的 Gmail 直接寄 | `CalendarApp.createEvent` 含受邀者、自動寄原生邀請 | **0** | **你熟 GAS、免網域、一支搞定，CP 值最高** |
| B1 Edge Function + Resend | Supabase | Resend API | 連結照用 | 0（免費 3000封/月） | 想統一在 Supabase 生態寄品牌 HTML 信；**強制要自有網域**（否則只能寄給自己） |
| B3 Calendar API（OAuth） | 需 OAuth | 不寄信 | 真·建事件 + RSVP 邀請 | 0 | 想要最正規 RSVP；但 GAS 已達九成效果，通常被 B2 取代 |
| B4 n8n | n8n 實例 | 串節點 | 串節點 | 0 自架/$20+雲 | 流程長出多分支（自動歸檔 Drive/發 Line 通知…）才划算 |

**演進路線**：階段 1 三件組（本週）→ 要全自動上 **B2 GAS**（面板按「確認會議」→ `fetch` 你的 GAS Web App URL，建議加 token 保護）→ 之後要品牌 HTML 信再加 Resend、流程變複雜再引入 n8n。

---

## 6. 技術與裝置（單檔 HTML+Supabase 如何演進 + PWA/RWD）

### 6.1 技術演進路徑
**先在現有單檔 HTML 上把六模組與資料表跑通、驗證 IA**，確認好用後再用 Vite + TypeScript + Tailwind 重構成正式 PWA（避免一開始過度工程）。資料層全程共用 Supabase Realtime + RLS。

### 6.2 PWA 最小門檻（已查證）
1. **HTTPS**（部署 GitHub Pages/Vercel/Netlify/Cloudflare Pages 皆自帶）。
2. **`manifest.json`**（name/start_url/display:standalone/icons；theme_color 沿用面板 `#185FA5`）。
3. **3 張圖示**：192、512、512-maskable（maskable 四周留 ~20% 安全邊距）。
4. **iOS 專用**：一定要 `apple-touch-icon`（iOS 不讀 manifest icon），加 `apple-mobile-web-app-*` meta。
5. **`sw.js` Service Worker**（離線可開）：**策略 = 靜態外殼 cache、Supabase 即時資料一律走網路**（不快取 API 回應，否則看到舊資料）。

### 6.3 手機 RWD 可用要點
- 桌機左側導覽、手機底部 Tab Bar；卡片手機改單欄堆疊、點開才展開 A–G。
- **看板拖拉在手機難用** → 改「狀態下拉選單 + 長按拖動」雙模式。
- 觸控目標 ≥ 44×44px（寄通知/加行事曆按鈕務必夠大）；輸入框 `font-size:16px`（避免 iOS 自動放大）。
- PWA 全螢幕用 `env(safe-area-inset-*)` + viewport `viewport-fit=cover`（避開瀏海/底部）。
- 長路徑/流程帶 `overflow-x:auto` 或 `word-break` 防橫向溢出。

> **離線只做「外殼可開 + 即時資料走網路」**；「離線也能勾選、回線再同步」是另一層 IndexedDB+衝突合併工程，列為後期、確有需求再做。

---

## 7. 分階段落地計劃

| 階段 | 做什麼 | 為何這順序（最有感） |
|---|---|---|
| **Phase 1（先做）** | ① 工具確認表（模組 2，含雙人評分）② 看板骨架（模組 1，8 段狀態 + Episode 卡片）③ 建 Drive 三層結構 + EP000 範本 | 你們正處「試工具」階段，確認表立刻有用；看板給每集一個家；Drive 秩序先立起來 |
| **Phase 2** | ④ 會議模組 + 零後端三件組（寄信/行事曆/.ics）⑤ 檔案地圖頁（命名規範/權限/快速連結）⑥ PWA 化（manifest+SW+圖示，手機可裝） | 協作節奏與檔案秩序成形；手機開始好用 |
| **Phase 3** | ⑦ 總覽 Dashboard ⑧ 會議全自動（GAS Web App）⑨ TS+Tailwind 重構為正式 PWA + RWD 細修 | 等資料夠多、IA 穩定，再做總覽、自動化與正式化 |

---

## 8. 待你和學弟確認的問題清單（附我的傾向）

> **工具選擇類一律保持中立（傾向＝你們試完自己決定）；流程/架構類我才給傾向。**

| # | 問題 | 我的傾向 |
|---|---|---|
| 1 | Google 帳號是**免費 Gmail 還是 Workspace**？ | **建議查清楚**——決定 Drive 用「共用雲端硬碟（Workspace）」還是「個人 Drive 版」，影響擁有權與長期安全 |
| 2 | 製作管理平台**最終落腳**：自建面板 vs 現成 SaaS（Notion/Airtable…）？ | 中立（請列入確認表試用）；但**現階段傾向先延續自建面板**驗證 IA，未來不排除搬家 |
| 3 | 發佈節奏：**雙週一集 / 每週一集**？ | 傾向**雙週一集起步**，跑順再加速，並常駐 1–2 集存貨 |
| 4 | 看板狀態要**幾欄**、標籤中文怎麼定？ | 傾向直接用上面 8 段，先不增減 |
| 5 | 兩人分工：**誰是預設 Owner、誰固定剪輯、審核怎麼交叉**？ | 傾向「審核一定交給另一個人」「剪輯固定單人」，其餘你們議定 |
| 6 | 錄音情境：**同地** vs **兩地遠端**？ | 純流程問題（影響 A 環節選同地單機分軌 or 遠端平台）；工具仍中立待測 |
| 7 | 各環節工具：A 錄音、轉錄、B LLM、C 語音、D 視覺、E/F 剪輯、G 發佈 | **全部中立——請依確認表試用後自己拍板**，我不預設 |
| 8 | 會議自動化先做哪階段？ | 傾向 **Phase 2 先上零後端三件組**，要全自動再上 **GAS（B2）** |
| 9 | 是否需要**虛擬主持人露臉**（HeyGen 類）還是純語音+圖卡？ | 中立（列入確認表）；影響 D 環節是否要虛擬主播類 |
| 10 | Phase 1 三件事**先做哪一件**？ | 傾向**先做工具確認表**（你們現在最痛的就是「不知道用哪個工具」） |
| 11 | AI 揭露 checklist 是否納入發佈流程？ | 傾向**必做**（節目用 AI 語音+視覺，G 環節加「AI 揭露已標記？」勾選欄） |

---

### 相關檔案（絕對路徑）
- 既有工作流：`C:\vibe coding\Podcast-Studio\docs\workflow-architecture.md`、`C:\vibe coding\Podcast-Studio\docs\workflow-integrated.md`
- 現有面板（將升級為模組 3）：`C:\vibe coding\Podcast-Studio\docs\prep-checklist.html`
- 將新增：`docs\manifest.json`、`docs\sw.js`、`docs\icons\`（PWA 化時）

**一句話總結**：這套「製作中心」用**工具確認表**中立輔助你們自己選工具、用**八段看板**管每集進度、用**檔案地圖**講清楚 Drive 怎麼放、用**會議模組**自動寄信提醒下次會議；資料全落 Supabase 即時共編、手機 PWA 可用——**先用單檔 HTML 驗證架構，再升級 TS+Tailwind。工具，由你和學弟試完自己拍板。**
