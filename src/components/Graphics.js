/* eslint-disable no-unused-vars */
import React from "react";
import { Chart } from "react-google-charts";


export const options = {
  chart: {
    title: "Projeção de Valores",
  }
};

export function Graphics({cAporte, sAporte}) {
  let keys = []
  let comAporte = [];
  let semAporte = []
  for (let [key, value] of Object.entries(cAporte)) {
    keys.push(key);
    comAporte.push(value);
  }

  for (let [key, value] of Object.entries(sAporte)) {
    semAporte.push(value);

  }
    return (
        <Chart
            chartType="Bar"
            width="98%"
            height="400px"
            data={[
              ["Tempo(mensal)", "Sem Aporte", "Com Aporte"],
              [`${keys[0]}`, `${semAporte[0]}`,`${comAporte[0]}`],
              [`${keys[1]}`, `${semAporte[1]}`,`${comAporte[1]}`],
              [`${keys[2]}`, `${semAporte[2]}`,`${comAporte[2]}`],
              [`${keys[3]}`, `${semAporte[3]}`,`${comAporte[3]}`],
              [`${keys[4]}`, `${semAporte[4]}`,`${comAporte[4]}`],
              [`${keys[5]}`, `${semAporte[5]}`,`${comAporte[5]}`],
              [`${keys[6]}`, `${semAporte[6]}`,`${comAporte[6]}`],
              [`${keys[7]}`, `${semAporte[7]}`,`${comAporte[7]}`],
              [`${keys[8]}`, `${semAporte[8]}`,`${comAporte[8]}`],
              [`${keys[9]}`, `${semAporte[9]}`,`${comAporte[9]}`],
              [`${keys[10]}`,`${semAporte[10]}`, `${comAporte[10]}`],
  
            ]}
            options={options}
        />
    );
}

