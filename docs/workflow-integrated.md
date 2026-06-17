# Podcast Studio 內容工廠 — 整合架構與工作流程（可討論版）

> 主題：兩位主持人（使用者 + 學弟）做「日本不動產」知識型 Podcast。
> 核心理念：**兩人自然閒聊對話是「原料」，AI 是「放大器」不是取代者**；所有 AI 環節保留「人在迴路」覆核點。
> 本文重點：**環節之間如何串接、資料怎麼流**。是給人拍板用的決策文件，不是實作手冊。
>
> 文件日期：2026-06-14 ｜ 搭配閱讀：`docs/workflow-architecture.md`（理念與選型總覽）

---

## 0. 環節命名對照（先對齊術語）

本文用「環節 A–G」當主標題，對齊既有文件的「階段 0–9」。兩套編號指同一條產線。

| 本文環節 | 既有階段 | 一句話 |
|---|---|---|
| **A** 選題 + 捕捉 | 階段 0 + 1 | 人主導選題、AI 輔助找題；兩人雙軌錄音 → 轉錄成帶 speaker/時間碼的逐字稿（**唯一原料**） |
| **B** 腳本化 | 階段 2 | 逐字稿 → AI 整理成結構化雙人對話腳本（去卡詞、保口語、**只整理不創造**） |
| **C** 語音合成 | 階段 3 | 克隆雙聲音依腳本生成自然無卡詞 master 音檔 + 字級時間碼 |
| **D** 視覺生成 | 階段 4 | 不出鏡：字幕/簡報卡/數據圖表/B-roll → 與時間軸對齊的 visual cue list |
| **E** 組裝 + 後製 | 階段 5 + 6 | Remotion 依 EDL 程式化組裝音/字幕/視覺三軌，套品牌包裝，FFmpeg 收尾出 master 成片 |
| **F** 轉化 + 發佈 | 階段 7 + 8 | 一份 master fan-out 成 YouTube/Shorts/Podcast/部落格/社群，多平台排程發佈（含 AI 揭露） |
| **G** 資產管理 + 編排 | 階段 9（貫穿） | Episode 物件當契約載體、狀態機驅動推進、job queue 跑長任務、守所有覆核閘門 |

---

## 1. 端到端流程總覽

```
            [人主導]          (自動)            [人:定稿]         [人:試聽]
  A 選題 ──────────▶ A 捕捉 ──────────▶ B 腳本化 ──────────▶ C 語音合成
  AI輔助找題         雙軌錄音→轉錄        AI整理對話腳本        克隆雙聲音→master音檔
  人拍板+查證        speaker/時間碼準     只整理不創造          +字級時間碼
                                              │                      │
                                              ▼                      ▼
                                        (script.approved)     (voice.master + cues)
                                                                     │
            [人:發佈閘]       [人:成片簽核]      [人:補數據圖]         │
  F 轉化發佈 ◀────────── E 組裝後製 ◀────────── D 視覺生成 ◀──────────┘
  master→多變體         Remotion EDL組裝       字幕/簡報/數據圖表
  多平台排程+AI揭露      品牌包裝→master成片     →visual cue list

  ┌──────────────────────────────────────────────────────────────────┐
  │  G 資產管理 + 編排（貫穿全程）                                       │
  │  Episode 物件=唯一真實來源 ｜ 狀態機驅動 ｜ job queue 跑長任務        │
  │  4 個強制覆核閘門：B定稿 / C試聽 / D數據圖 / E成片簽核               │
  └──────────────────────────────────────────────────────────────────┘
```

**人工介入點（品質防線，共 6 處）**：
1. A 選題拍板（AI 給候選+初評，人決定哪題進製作）＋資料 T1/T2 來源查證
2. A 捕捉後逐字稿/詞庫快掃（speaker、專有名詞）
3. **B 腳本定稿**（diff 逐句覆核，全行 approved 才放行）← 核心閘門
4. **C 語音試聽**（逐句重生、調情緒停頓）← 核心閘門
5. **D 數據圖表查證**（數字/年份/出處，可信度命脈）← 核心閘門
6. **E 成片簽核**（音畫同步、品牌、響度）＋ F 發佈時機與 AI 揭露勾選 ← 核心閘門

> 自動環節（捕捉轉錄、轉化 fan-out）鏈式觸發省力；只在「AI 改動內容 / 扣費 / 成片 / 數據」這幾處卡人。

---

## 2. 環節串接總表（本文最重要）

> 一行一環節：**輸入←來源 ｜ 做法摘要 ｜ 輸出→去向 ｜ 觸發方式 ｜ 人工卡點**。
> 串接金律：**視覺/字幕不用「絕對秒數」綁定，改用 `cue_id`（句 id）+ 偏移**，這樣語音逐句重生成後時間軸自動跟隨，不必重標。

| 環節 | 輸入 ← 來源 | 做法摘要 | 輸出 → 去向 | 觸發方式 | 人工卡點 |
|---|---|---|---|---|---|
| **A 選題** | 靈感/聽眾提問/時事、日本不動產官方資料、既有詞庫 | LLM 以 5–6 條 pillar 框架找題；三軸評分(value0.4/trend0.25/feasibility0.35)；生大綱+key_questions+facts_to_verify | `ideation{outline, references[trust_tier], score, key_questions, facts_to_verify}` → **B** | 人手動建 Episode（同步） | **是**：選題拍板＋來源 T1/T2 查證 |
| **A 捕捉** | `ideation`、兩人雙軌錄音(track_a/b WAV) | 複用 line-inspiration-helper：雙軌各轉錄→shift offset→merge（speaker 由軌別決定，免 diarization）；詞庫雙保險(Whisper prompt + A=>B 替換) | `capture{segments[speaker,start,end,text,confidence], transcript.md, srt/vtt, glossary_hits}` → **B**、**D** | 上傳音檔→enqueue 轉錄（**非同步**） | 否（自動）＋事後快掃逐字稿/詞庫 |
| **B 腳本化** | `capture.segments`(含 speaker/時間碼)、glossary、`ideation.outline` | 同 speaker 併 turn→切 chunk(帶 overlap)→LLM tool calling 強制 JSON；`origin`標 cleaned/merged/bridged；每行帶 emotion/pause/讀音/`source_seg_ids` | `script.dialogue[line_id, speaker, text, emotion, pause_after_ms, pronunciation_overrides, source_seg_ids, origin]` + `approved` → **C**、**D** | capture 完成事件自動 enqueue LLM（非同步）+ 同步覆核 | **是**：逐句 diff 定稿，全行 approved 才解鎖 |
| **C 語音合成** | `script.dialogue`(approved=true)、`voice_profiles`(雙人 voice_id) | ElevenLabs Text-to-Dialogue with timestamps：分批(≤2000字/≤10 voice)→逐句切分落地→注入句間停頓→FFmpeg concat 成 master；emotion 映射成 audio tags | `voice.lines[audio_url, start_ms, end_ms, duration_ms]` + `master_audio_url` + `alignment/SRT/VTT`（**cues[] 是三軌對齊唯一真值**） → **D**、**E**、**F** | script approve → enqueue TTS（**非同步長任務**） | **是**：逐句試聽/重生、調情緒停頓 |
| **D 視覺生成** | `script`、`voice.lines`(word timestamps)、SRT/VTT、`ideation.references`、brand kit | 以 word timestamps 為骨架；LLM 讀 script+section_tag 決策「哪句配什麼」→輸出 cue（綁 `cue_ref`+anchor+offset）；caption 全自動，數據句強制 chart 且 needs_human | `visual_cue_list[cue_id, cue_ref, type(slide/caption/chart/map/photo/broll/lower_third), content, asset_url, source, status, needs_human]` + `source_manifest` → **E** | voice approve → enqueue 視覺生成（**非同步長任務**） | **是**：數據圖表數字/出處查證、AI 圖選擇 |
| **E 組裝後製** | `voice.master_audio_url`+`cues[]`、`visual_cue_list`、字幕、brand kit | resolve：把 cue_ref 解析成絕對秒數寫進 EDL；Remotion 分層渲染(背景/視覺/說話者高亮/字幕/品牌)；BGM ducking、轉場、片頭尾；FFmpeg loudnorm + 多解析度收尾 | `assembly.timeline_edl` + `video_drafts[master MP4 + 乾淨無字幕版]` + 章節JSON + SRT/VTT + 純音檔 → **F** | visuals approve → enqueue Remotion 渲染（**非同步長任務**） | **是**：渲染前 EDL 預覽 + 成片簽核（音畫同步/品牌/響度） |
| **F 轉化發佈** | 簽核過的 master 影片/音檔、字幕、章節、`script.dialogue`、`ideation.outline` | fan-out：YouTube長片(直用)、Shorts(Vizard API 高光切片)、Podcast(自架 RSS + Podcasting 2.0 transcript/chapters)、blog(LLM 改寫+JSON-LD)、社群短文(各平台調性) | `outputs{youtube, shorts[], podcast_audio+RSS, blog_md, social[]}` + `publish.platform_status` → 各平台 | assembled approve → fan-out 轉化 task；人選排程→定時發佈 | **是**：切片選擇/改 hook、標題縮圖章節覆核、**發佈前強制勾 AI 揭露** |
| **G 資產+編排** | 全部環節讀寫同一 Episode | Episode=唯一真實來源(JSONB)；狀態機守合法轉移；Celery 分佇列跑長任務(idempotency_key 防重複扣費)；物件儲存版本+血緣 | `assets/jobs/approvals/events` 表；狀態快照→看板；下一棒觸發 | 監聽所有環節事件、驅動狀態機 | **守所有閘門**（4 個強制 + 選題/發佈時機） |

---

## 3. 各環節詳述（目的 / 做法 / 首選工具 / 資料契約）

### 環節 A — 選題 Ideation + 捕捉 Capture

- **目的**：持續產出「值得做、做得出來」的題目與大綱；把兩人最自然的閒聊以雙軌乾淨音檔捕捉、轉成帶 speaker 與時間碼的逐字稿，當整條產線的**唯一原料來源**。
- **具體做法**：
  - 選題：PostgreSQL `topic_idea` 題庫看板；固定 5–6 條 pillar（稅制/法規權利/市場數據/金流房貸/實務踩雷/跨境台灣人買日本房）防發散；LLM 以 pillar 找題＋三軸初評，人拍板；大綱只當「給兩人閒聊的地圖」，刻意留白。
  - 捕捉：**幾乎零開發**，直接複用 `line-inspiration-helper` 的雙軌匯入 + `/api/captions` + 詞庫。兩人各錄一軌→speaker 天生確定（不需 diarization）；開錄前 clap 對齊拍點；詞庫雙保險處理日文不動產專有名詞（区分所有/利回り/重要事項説明/路線価）。
- **首選工具與理由**：捕捉層複用既有 whisper-1 雙軌流程（speaker 與時間碼天生精準、$0.006/分鐘）；選題用 Claude 找題/初評/大綱。把新開發集中在「選題評分 UI + 人在迴路」這個真正要新做的地方。
- **資料契約**：
  - 上游：無正式環節（人 + 外部資料）。
  - 下游 A→B：交付 `capture.segments[{seg_id, source_start, source_end, speaker, text, confidence?}]` + glossary + `ideation`。**契約關鍵**：腳本化只能在「已捕捉的真實對話 + 已標 T1/T2 來源」範圍內整理。

### 環節 B — 腳本化 Scripting

- **目的**：把口語逐字稿整理成可直接餵 TTS 的結構化對話腳本——去卡詞贅詞、補邏輯、保留兩人口語風與默契，**嚴禁新增沒講過的觀點/數據**。
- **具體做法**：`preprocess`(併 turn + glossary 標準化) → `chunker`(依沉默/話題邊界切，帶前後 overlap) → LLM **tool calling 強制 JSON schema**（不自由生成再 parse）→ `assembler`(重新編號、回填 source_seg_ids、套讀音)。System prompt 紅線：「你是編輯不是作者，只能用不改變語意的承接詞橋接，需補的內容寫進 note 標 `[需確認]` 不寫進 text」。
- **首選工具與理由**：Claude（Opus 校準基準、Sonnet 量產）+ tool calling。中文口語整理品質與「只整理不創造」的指令服從度最關鍵；tool calling 把輸出硬綁成可直餵下游的結構。先不上 n8n，自建 pipeline 對逐句 diff/回溯掌控最完整。
- **資料契約**：
  - 上游 B 只依賴 `capture.segments` 的 speaker/時間碼/text + glossary；若上游無 speaker 分軌，B 退化用 LLM 推測並全標 `[需確認]`。
  - 下游 B→C：交付 `script.dialogue[]`（須 `approved:true`）；C 用 speaker 查 voice_id，用 emotion/pause/讀音控合成，**C 不得改 text**（要改退回 B 重審）。

### 環節 C — 語音合成 Voice Synthesis

- **目的**：用克隆的兩人聲音把定稿腳本轉成自然、無卡詞、有情緒停頓的雙人 master 音檔，並附每句精準時間碼餵下游做字幕/畫面同步。
- **具體做法**：逐句生成 + 服務端拼接。ElevenLabs v3 **Text-to-Dialogue with timestamps**（跨 turn 匹配情緒/輪替，是「不像機器人各念各的」的關鍵）；emotion 映射成 inline audio tags(`[laughs]`/`[hesitates]`)；繁中專有名詞掛 pronunciation dictionary（與捕捉層詞庫共用一份）；句間停頓固定參數(換手 350–550ms / 同人 200–300ms)，覆核 UI 可逐句微調。
- **首選工具與理由**：MVP 用 ElevenLabs——唯一同時解決「雙人對話自然度」與「下游所需精準時間碼(voice_segments + 字級 alignment 直出 SRT/VTT)」的方案，讓 C→E 零摩擦。中長期把高頻「重生試聽」分流到 Fish/MiniMax 或自架 GPT-SoVITS 降本，保留 provider 抽象層。
- **資料契約**：
  - 上游 C→讀 `script.dialogue`(approved) + voice_profiles。
  - 下游 C→D/E：交付 `voice.lines[start_ms,end_ms]` + `master_audio_url` + `cues[]`。**`master_audio.cues[]` 是三軌對齊的唯一真值**（TTS 每句 duration 累加，無估算誤差）。

### 環節 D — 視覺生成 Visuals（不出鏡）

- **目的**：在兩人不出鏡前提下，產生與音檔逐句對齊的視覺軌（字幕/簡報卡/數據圖表/地圖/B-roll），把對話變成可看的知識影片，並守住數據可信度。
- **具體做法**：以 `voice.lines` 的 **word-level timestamps 為時間骨架**；LLM 讀 script+section_tag 對每句決策視覺類型，輸出 cue（**用 `cue_ref`+anchor+offset 綁句，不綁秒數**）。caption 全自動鋪滿；數據句**強制走 chart 並掛 source_manifest**，status=draft、needs_human=true 等人填真實數據。**鐵律**：事實宣稱(價格/利回り/年份)一律 chart+出處由人覆核；AI 圖只做示意/封面/氛圍，不代替真實數據或真實物件。
- **首選工具與理由**：主幹 Remotion（程式化、模板化、被 cue_list 驅動、原生字幕 + Recharts 圖表、兩人團隊免費可商用）；配圖 Nano Banana Pro（圖內中文可靠、可查證）為主、Flux 2 補 cinematic 空鏡；虛擬主播列可選加值不進 MVP。
- **資料契約**：
  - 上游 D→讀 `script` + `voice.lines`(timestamps) + SRT/VTT + references + brand kit。
  - 下游 D→E：交付 `visual_cue_list`（每 cue 綁 cue_ref）+ `source_manifest`；未過數據查證的 cue 不得進 E。

### 環節 E — 組裝 Assembly + 後製 Post

- **目的**：用 Remotion 把 master 音檔 + 字幕 + 視覺 cue 在同一條時間軸精準同步組裝成成片，套品牌包裝，FFmpeg 收尾出高品質 master，交下游轉化。
- **具體做法**：**雙路徑共用一份 EDL**——快路徑(自動)：resolve cue_ref→絕對秒數寫進 EDL→Remotion 分層渲染(L0背景/L1視覺/L2說話者高亮/L3字幕/L4品牌)→FFmpeg 轉碼。慢路徑(手動)：覆核不過→載入同一份 EDL 進波形編輯器精修切點/字幕/重生語音→存回 EDL→重渲染。BGM ducking、`@remotion/transitions` 轉場、片頭尾元件、loudnorm 到 -14 LUFS(YT)/-16 LUFS(Podcast)。
- **首選工具與理由**：Remotion（程式化模板，換集只換 EDL、版型零改，與 TS 前端一致）+ FFmpeg（補轉碼/多解析度/響度）+ 波形編輯器當第二路徑。MVP 只跑自動路徑出 YouTube 長片。
- **資料契約**：
  - 上游 E→讀 `voice.master_audio_url`+`cues[]`、`visual_cue_list`、brand kit。**契約金律：上游必須用 cue_ref 綁定**，E 才能在 resolve 時自動跟隨重生成。
  - 下游 E→F：交付乾淨 master MP4 + 燒字幕版 + 章節 JSON + SRT/VTT + 純音檔 + render manifest。

### 環節 F — 轉化 Repurpose + 發佈 Publish

- **目的**：一份 master 半自動轉成多平台原生格式並合規發佈（含 AI 揭露），「一源多形 + 人覆核後才 publish」。
- **具體做法**：三個子服務（repurpose/metadata/publisher）+ 人工覆核閘。Shorts 用 Vizard API（提交→輪詢→取回 9:16 切片含字幕與 virality 分數，注意 Reels 限 5–90 秒）；Podcast 走**自架 RSS + Podcasting 2.0**(podcast:transcript/chapters)；blog 用 LLM 改寫成 H2/H3 + JSON-LD；標題/縮圖/章節半自動生成由人選一。發佈用自架 Postiz(開源多平台)，YouTube 走官方 Data API v3(原生 `containsSyntheticMedia` 揭露欄位 + `publishAt` 排程)。
- **首選工具與理由**：切片 Vizard(API 含在付費方案、最快跑通)；發佈 Postiz(開源免月費、與「掌控長期 feed」理念一致)；YouTube/Podcast 自己掌控揭露與 feed。成本與掌控度平衡，後續可把切片換自建 FFmpeg 降本。
- **資料契約**：
  - 上游 F→讀「成片簽核」過的 master + 字幕/章節/腳本。
  - 下游 F→各平台 + 回寫 `publish.platform_status{status, post_url, ai_label_applied}`。

### 環節 G — 資產管理 + 編排（貫穿）

- **目的**：把 A–F 串成「可驅動、可暫停、可回溯」的產線。Episode 當契約載體與唯一真實來源，狀態機驅動推進，job queue 跑長任務，物件儲存 + 版本/血緣讓素材可重用可追溯，每個 AI 環節後卡人在迴路。
- **具體做法**：自建 FastAPI + Celery + Redis + PostgreSQL + 物件儲存(MinIO→R2)。Episode 各環節「只讀上游欄位、只寫自己欄位」；狀態機拒絕非法轉移；長任務 `idempotency_key=episode:stage:input_hash` 防重複扣費，分佇列限流；asset 不覆寫只加版本(parent_id 血緣)。**n8n 只留給 M6+ 外圍無狀態雜務(定時抓題/多平台排程)，絕不持有 Episode 狀態**。
- **首選工具與理由**：自建 Celery 讓「狀態機 / 長任務 / 人在迴路」三件最關鍵的事緊密可控且零新框架；不上 Temporal(雙人小團隊過度工程)。
- **資料契約**：對所有環節保證「下游被觸發時其讀的上游欄位已存在且已過閘門」（例如語音被觸發時 `script.approved===true` 必為真），這條不變式由狀態機強制。

---

## 4. Episode 物件與狀態機：串接的載體

**Episode = 唯一真實來源（single source of truth）**。每環節只讀自己上游欄位、只寫自己欄位，形成資料契約；狀態機定義合法轉移，非法轉移一律拒絕。

```
ideation ──capture done──▶ captured
captured ──LLM 腳本化────▶ scripted_pending_review ──人 approve──▶ scripted
scripted ──TTS(長任務)───▶ voiced_pending_review   ──人 試聽────▶ voiced
voiced   ──視覺生成──────▶ visualized_pending_review─人 補圖表──▶ visualized
visualized ─Remotion 渲染▶ assembled_pending_review ─人 簽核───▶ assembled
assembled ─轉化+發佈─────▶ published
```

- 每個 `*_pending_review` = 一個**人在迴路閘門**：環節做完不自動往下，寫一筆 `approval(pending)`，等前端 approve 才 enqueue 下一棒；reject/request_changes 退回上一狀態並夾帶修改建議。
- 另有正交旗標 `failed`（任務失敗可重跑，重用 idempotency_key 不重複扣費）。
- **DB 設計**：status/title/時間戳等查詢欄位正規化（方便看板/索引）；script/voice/visuals 等隨環節演進的區塊放 JSONB（迭代不改 schema）。
- **可重用資產**：聲音模型 voice_id、片頭尾、品牌模板、可複用圖表標 `reusable=true, episode_id=null` 跨集共用，並記 `source_asset_ids` 供反向影響查詢。

**資料流串接的兩條金律（最重要）**：
1. **三軌對齊用 `cue_id` 不用秒數**：`voice.cues[]` 是唯一時間真值；視覺/字幕用 `cue_ref`+anchor+offset 綁句。語音逐句重生成後句長變了，視覺自動跟隨，不必重標 → 這是讓「重生成不破壞同步」的關鍵。
2. **閘門由狀態機強制**：下游能被觸發 ⟺ 上游欄位已存在且已過 approve。

---

## 5. 待你拍板的關鍵決策清單（去重彙整）

> 每條附建議。標 ★ 者影響整條產線串接，建議優先拍板。

| # | 決策 | 我的建議 |
|---|---|---|
| **D1 ★** | 三軌對齊錨點用「絕對秒數」還是「cue_id + 偏移」？ | **cue_id + anchor + offset**。這是讓逐句重生成不破壞同步的關鍵，務必要求 C/D 的資料契約改用 cue_ref 綁定，E 在 resolve 時才轉秒數。 |
| **D2 ★** | 產線編排主幹用自建 Celery 還是 n8n？ | **混合**：主幹自建 FastAPI+Celery（狀態/長任務/覆核）；n8n 只做 M6+ 定時與多平台發佈這類無狀態雜務，不持有 Episode 狀態。 |
| **D3 ★** | 環節間「事件自動推進」還是「每步等人」？ | **只在 4 個關鍵 AI 環節卡覆核**(B定稿/C試聽/D數據/E簽核)，其餘(轉錄、轉化)鏈式自動觸發。兼顧人在迴路與效率。 |
| **D4** | 聲音模型主力怎麼建？ | **雙軌並行**：立刻用零樣本/Instant 跑通 MVP 不卡進度，同時排程錄 ElevenLabs PVC 語料(每人 30 分鐘乾淨繁中，訓練 3–4 週)，2–3 集後切 PVC 當長期主力。 |
| **D5** | LLM 腳本整理「介入強度」？ | 預設 **重整理但嚴守「不創造觀點」紅線**，用 origin=bridged 高亮讓覆核聚焦改動行；長期做成強度滑桿。MVP 先用重整理。 |
| **D6** | 草稿 LLM 用哪個檔次？ | **Opus 校準首集/難題定基準，常態 Sonnet 量產**，難集再升 Opus。 |
| **D7** | 情緒/停頓標記在 B 標還是 C 標？ | **在 B 標**（此時有原音上下文與覆核者在場，標得準可校）；C 直接消費。 |
| **D8** | MVP 是否納虛擬主播？ | **先純簡報式**(Remotion 字幕+圖表+說話者高亮)跑通一集；品牌穩定後再 A/B 測是否加，且只用克隆自己形象、照實揭露。 |
| **D9** | 數據圖表「資料填入」要多自動？ | **MVP 用 LLM 抽草稿 + 人工逐項驗證出處**；中期投資串國土交通省/日本不動産研究所等公開資料把可信度與效率一起拉高。 |
| **D10** | 配圖自動化主力？ | **資訊圖/含字卡片用 Nano Banana Pro，純氛圍空鏡用 Flux 2**（皆有 API）；Midjourney 無 API 不納入自動化。AI 圖僅限示意，真實物件用授權圖庫/實拍。 |
| **D11** | Remotion 渲染本機還是 Lambda？ | **MVP 本機 subprocess 跑通**；量產/長片再切 Lambda。把 render 抽成 service 之後無痛切換。 |
| **D12** | 多平台發佈自建直連還是統一中介？ | **MVP 用 Postiz(開源自架)跑通多平台**，YouTube 與 Podcast RSS 仍自建直連以掌控揭露欄位與 feed；規模化再評估 Ayrshare。 |
| **D13** | Shorts 切片用 Vizard 還是自建 FFmpeg+LLM？ | **先 Vizard 跑通並建品質基準**，量大或成本敏感再切自建；OpusClip API 封閉 beta 暫不採用。 |
| **D14** | Podcast 發佈託管還是自架 RSS？ | **自架 RSS 為主**(長期掌控 + Podcasting 2.0 transcript/chapters)，Spotify 端透過 RSS ingest 併存。 |
| **D15** | AI 揭露執行到哪？ | **MVP 做平台級揭露**(YouTube containsSyntheticMedia + IG Made with AI 即合規)；面向 EU 受眾再加 C2PA 簽章(注意多平台會剝除 metadata)。 |
| **D16** | 物件儲存初期用什麼？ | **開發用 MinIO**(與正式環境 API 一致可無痛切換)，上線換 Cloudflare R2(影片大檔、出口免費)；不要用裸檔案系統。 |
| **D17** | Episode 各區塊用 JSONB 還是全正規化？ | **狀態/metadata 正規化 + 各環節區塊 JSONB**：查詢欄位好索引，演進中的結構迭代不改 schema。 |
| **D18** | 不動產專用詞庫獨立檔還是併入主詞庫？ | **Podcast 專案獨立 `glossary_japan_re.txt`，載入時與主詞庫合併**：職責分離、不污染原專案個人字典。 |
| **D19** | 日本官方資料如何取得？ | 先 **AI 輔助抓取+翻譯+落 Obsidian、人覆核**(複用既有 extractor)；高頻引用數據(地価/利率/稅率)穩定後再升級成結構化定期同步快取，避免一開始過度工程。 |

---

## 6. 建議的 MVP 起步切法（最小可跑通一集）

**目標**：用最小環節子集跑通「一集端到端半自動」，把後製從數小時降到「組裝+覆核」等級。

**納入的鏈（對齊既有 M1–M4）**：

```
A 捕捉   複用 line-inspiration-helper 雙軌轉錄          [幾乎 0 開發]
   │     → capture.segments(speaker/時間碼/詞庫)
   ▼
B 腳本化  Claude + tool calling 整理對話腳本            [新:1 LLM pipeline + 覆核 UI]
   │     → script.dialogue(approved)   【人:定稿閘門】
   ▼
C 語音    ElevenLabs Text-to-Dialogue 雙聲音 + cues[]   [新:串 API]
   │     → voice.master + cues          【人:試聽閘門】
   ▼
D 視覺    Remotion caption(自動) + slide + 人填數據 chart [新:cue_list + 模板]
   │     → visual_cue_list(cue_ref 綁句) 【人:補數據圖】
   ▼
E 組裝    Remotion resolve EDL + FFmpeg → YouTube 長片   [新:自動路徑]
         → master MP4                   【人:成片簽核】
```

**MVP 邊界（先不做，避免過度工程）**：
- 不做：Shorts 自動切、多平台發佈、虛擬主播、AI 影片 B-roll、地圖自動化、自架 Podcast RSS、波形編輯器精修第二路徑。
- 編排只先實作 `captured→scripted→voiced→visualized→assembled` 主鏈 + 4 個覆核閘門（不一次建全狀態機/全前端）。
- 渲染先本機 subprocess；物件儲存先 MinIO；聲音先零樣本/Instant（PVC 平行排程）。

**起步動作（建議順序）**：
1. **先拍板 D1–D3**（三軌對齊用 cue_id、主幹自建、只卡 4 個閘門）——這三條決定整個串接骨架。
2. 從 **A 捕捉 + B 腳本化** 起步：把既有轉錄接上「AI 腳本化 + 覆核介面」，這是摩擦力最大、最快見效的一段。
3. 平行測 **ElevenLabs 中文克隆**：兩人各錄 3–5 分鐘乾淨語料做聲音模型，試聽品質再決定是否排 PVC。
4. 跑通一集 → 再逐步補 Shorts/多平台/虛擬主播。

> 核心原則複述：先跑通一集端到端「半自動」，再逐步加自動化。別讓「建工廠」本身變成新的摩擦力。
