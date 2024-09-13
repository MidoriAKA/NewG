import fs from "fs";
import {parse} from "csv-parse";

export const convertCsvToJson = async (csvPath: string) => {
  console.log("start");
  let csvData = fs.readFileSync(csvPath, "utf8");
  if (csvData.charCodeAt(0) === 0xFEFF) {
    csvData = csvData.slice(1);
  }
  parse(csvData, {
    delimiter: ";",
    columns: true,
    skip_empty_lines: true,
  }, async (err, output) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("parsed");
    const formattedJsonData = await formatJson(output);
    console.log("saved");
  });
}

export const formatJson = async (csvData: Array<any>) => {
  
  let formattedJsonData = [] as Array<any>;

  // IDの空白を削除
  csvData.forEach((data: any, index: number) => {
    data.ID = data.ID.replace(/\s/g, '');
    formattedJsonData[index] = Object.entries(data);
  });

  // 各配列の最後の要素を削除
  formattedJsonData.forEach((element: any) => {
    element.pop();
  });

  // 日付の文字列を数字に変換
  formattedJsonData.forEach((element: any) => {
    element[3][1] = element[3][1].replace(/[-\s:]/g, '');
    element[3][1] = Number(element[3][1]);
    element[4][1] = element[4][1].replace(/[-\s:]/g, '');
    element[4][1] = Number(element[4][1]);
  });
  console.log("formatted");
  return formattedJsonData;
}