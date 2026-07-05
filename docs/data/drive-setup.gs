/**
 * Podcast (Adoro x Kaku) — Google Drive 整理與自動化
 *
 * 用法：到 https://script.google.com 新建專案 → 把整段貼上 → 選一個函式 → 執行
 *       （第一次會要求授權 Drive，按允許）。
 * 由「對這個共用資料夾有編輯權」的帳號執行（kaku 或 Hiro 皆可）。
 * 註：cleanupOldPersonalHub() 只有 kaku88life 能跑（那是他個人 Drive 的資料夾）。
 */

var EPISODES_FOLDER = '1pTEZeupaWcQ8mf7WEHb-5bxK2XCs3F6Q'; // 20_EPISODES_每集製作
var MEETINGS_2026   = '1q5yUpe7tjRreGuxXmAYyISnd-nTlEuj6'; // 00_ADMIN/Meetings/2026
var SUBFOLDERS = ['A_企劃_Plan','B_腳本_Script','C_語音_Voice','D_視覺_Visual','E_剪輯_Edit','F_包裝_Package','G_發佈_Publish'];

var EP001 = {
  A: '143w8YPDIMuFg8GIzvkLxCajgjiOosfvc', // EP001/A_企劃_Plan
  B: '1yb--P6Ekt2Rq42IYeiRG164-jDuykoxq', // EP001/B_腳本_Script
  C: '1ZJ7D_tKppKckB2gcY71mFK12YbicZwCn', // EP001/C_語音_Voice
  D: '1xLlLVkCqsItr97F8eB0oRAVEVPMAqCbt', // EP001/D_視覺_Visual
  E: '1qg-jfTozV-qwsoYI8owk3ckOsq-QPI3l', // EP001/E_剪輯_Edit
  F: '1bbD6W0fiTSJ-sH1n4XUNJkg2YOVlvoan', // EP001/F_包裝_Package
  G: '1JV4zFwfpTqBTmVyFHx2Mg5J3iXfKRe-Y'  // EP001/G_發佈_Publish
};

/**
 * 1) 把現有檔案歸位。先看下面對應，要改目的地就改那一行再執行。
 *    跑完看「執行紀錄」確認每筆成功。失敗的（多半是權限）改用手動拖曳即可。
 */
function organizeFirstEpisode() {
  moveFile('1JSWomhnb52--64C_J7T-SyejrFeqkdYtaIN86-sMWPM', EP001.B); // 第一集草稿 (Hiro)  -> EP001/B_腳本
  moveFile('1BSycbqsTcbErI-U-XLrTn6yUKaM-hrQDnfyZEgpcVus', EP001.A); // Episode 1 (Slides) -> EP001/A_企劃（若是視覺稿改成 EP001.D）
  moveFolder('1ws3oUhgzx_SMNQl_bIcl9-bG5RU86htl', EP001.C);          // Recording 資料夾    -> EP001/C_語音
  moveFolder('1K6wpVJsy5Zyj2riYVCqmz0xM71uyMHkk', MEETINGS_2026);    // 舊「會議記錄」資料夾 -> Meetings/2026
  // SNS Sample (1vJbAkv5Sr2Gp0lWuH8r_oy5QDQZjfBAdNkaIs9mfMpk)：屬發佈範本，建議自行 moveFile 到 EP000/G 或 10_SHARED。
}

/**
 * 2) 新增一集：在指令碼編輯器上方函式選 newEpisode，或自行呼叫 newEpisode(2, '空屋投資')。
 *    會在 20_EPISODES 下建 EP002_空屋投資 並複製 A–G 七個子夾。
 */
function newEpisode(epNo, topic) {
  if (epNo == null) { epNo = 2; topic = '範例主題'; } // 直接按執行時的預設
  var name = 'EP' + ('00' + epNo).slice(-3) + '_' + (topic || '');
  var ep = DriveApp.getFolderById(EPISODES_FOLDER).createFolder(name);
  SUBFOLDERS.forEach(function (s) { ep.createFolder(s); });
  Logger.log('已建立 ' + name + '：' + ep.getUrl());
  return ep.getUrl();
}

/**
 * 3) 清掉先前誤建在「kaku 個人 Drive」的空 PodcastStudio（只有 kaku88life 能跑）。
 */
function cleanupOldPersonalHub() {
  DriveApp.getFolderById('1W2G2vzGeVbPvum3Bph7c9dTr2c78IxhX').setTrashed(true);
  Logger.log('已把個人 Drive 的 PodcastStudio 移到垃圾桶。');
}

function moveFile(fileId, destFolderId) {
  try { DriveApp.getFileById(fileId).moveTo(DriveApp.getFolderById(destFolderId)); Logger.log('OK 檔案 ' + fileId); }
  catch (e) { Logger.log('失敗 檔案 ' + fileId + '：' + e); }
}
function moveFolder(folderId, destFolderId) {
  try { DriveApp.getFolderById(folderId).moveTo(DriveApp.getFolderById(destFolderId)); Logger.log('OK 資料夾 ' + folderId); }
  catch (e) { Logger.log('失敗 資料夾 ' + folderId + '：' + e); }
}
