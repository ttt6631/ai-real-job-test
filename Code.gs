const OWNER_EMAIL = 'ttt6631@naver.com';
const SHEET_NAME = 'feedback';

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const props = PropertiesService.getScriptProperties();
    let ssId = props.getProperty('SPREADSHEET_ID');
    let ss;
    if (ssId) {
      ss = SpreadsheetApp.openById(ssId);
    } else {
      ss = SpreadsheetApp.create('AI 현실 직업검사 - 수검자 피드백');
      props.setProperty('SPREADSHEET_ID', ss.getId());
    }
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) {
      sh = ss.insertSheet(SHEET_NAME);
      sh.appendRow(['timestamp','version','ratings_json','comment','profile_json','top_results_json']);
    }
    const timestamp = data.timestamp || new Date().toISOString();
    const ratings = JSON.stringify(data.ratings || {});
    const comment = String(data.comment || '');
    const profile = JSON.stringify(data.profile || {});
    const topResults = JSON.stringify(data.topResults || []);
    sh.appendRow([timestamp, data.version || 'FINAL', ratings, comment, profile, topResults]);

    const ratingLines = Object.entries(data.ratings || {}).map(([job,r]) => `${job}: ${r}`).join('\n') || '(평가 없음)';
    const topLines = (data.topResults || []).map(x => `${x.rank}. ${x.occupation} / 종합 ${x.total} / 심리 ${x.psychology} / 현실 ${x.reality} / 미래 ${x.future}`).join('\n');
    MailApp.sendEmail({
      to: OWNER_EMAIL,
      subject: '[AI 현실 직업검사] 새 수검자 피드백',
      body: `새로운 피드백이 도착했습니다.\n\n시간: ${timestamp}\n\n[직업 평가]\n${ratingLines}\n\n[건의사항/특이점]\n${comment || '(작성 없음)'}\n\n[TOP 10]\n${topLines}\n\n[검사 조건]\n${JSON.stringify(data.profile || {}, null, 2)}\n\n저장된 스프레드시트: ${ss.getUrl()}`
    });
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}
