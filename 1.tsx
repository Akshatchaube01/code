type DataItem = {
  "REPORT-DATE": string;
  "METRIC": string;
  "VALUE": number;
};

const data: DataItem[] = [
  {
    "REPORT-DATE": "2023-04",
    "METRIC": "Avg Final PD_BT",
    "VALUE": 1
  },
  {
    "REPORT-DATE": "2023-04",
    "METRIC": "Avg Model Modified PD_BT",
    "VALUE": 2
  },
  {
    "REPORT-DATE": "2023-05",
    "METRIC": "Avg Final PD_BT",
    "VALUE": 3
  },
  {
    "REPORT-DATE": "2023-05",
    "METRIC": "Avg Model Modified PD_BT",
    "VALUE": 4
  },
  {
    "REPORT-DATE": "2023-06",
    "METRIC": "Avg Final PD_BT",
    "VALUE": 5
  },
  {
    "REPORT-DATE": "2023-06",
    "METRIC": "Avg Model Modified PD_BT",
    "VALUE": 6
  },
  {
    "REPORT-DATE": "2023-07",
    "METRIC": "Avg Final PD_BT",
    "VALUE": 7
  },
  {
    "REPORT-DATE": "2023-07",
    "METRIC": "Avg Model Modified PD_BT",
    "VALUE": 8
  },
  {
    "REPORT-DATE": "2023-08",
    "METRIC": "Avg Final PD_BT",
    "VALUE": 9
  },
  {
    "REPORT-DATE": "2023-08",
    "METRIC": "Avg Model Modified PD_BT",
    "VALUE": 10
  },
  {
    "REPORT-DATE": "2023-09",
    "METRIC": "Avg Final PD_BT",
    "VALUE": 11
  },
  {
    "REPORT-DATE": "2023-09",
    "METRIC": "Avg Model Modified PD_BT",
    "VALUE": 12
  }
];

function transformDataByDate(data: DataItem[]): { [key: string]: any }[] {
  const result: { [key: string]: any }[] = [];
  const dateMap: { [key: string]: { [key: string]: any } } = {};

  data.forEach(item => {
    const date = item["REPORT-DATE"];
    if (!dateMap[date]) {
      dateMap[date] = { month: date };
    }
    const metricKey = item["METRIC"].toLowerCase().replace(/ /g, "_");
    dateMap[date][metricKey] = item["VALUE"];
  });

  for (const key in dateMap) {
    result.push(dateMap[key]);
  }

  return result;
}

const transformedData = transformDataByDate(data);
console.log(transformedData);
