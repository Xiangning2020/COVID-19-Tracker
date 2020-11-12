import { Circle, Popup } from "react-leaflet";
import React from "react";
import numeral from "numeral";
import "./util.css";

export const sortData = (data) => {
  let sortData = [...data]; // 这个地方就是把不是array的变成array，
  // 之后才能使用sort 是array方法。
  sortData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
  return sortData;
};

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 800,
  },
  deaths: {
    hex: "#fb4443",
    multiplier: 2000,
  },
};

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const showDataOnMap = (data, casesType = "cases") => {
  // console.log(data);
  return data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      fillOpacity={0.4}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
};

// // // ));
// // // };

// export const showDataOnMap = (data, casesType = "cases") =>
//   data.map((country) => (
//     <Circle
//       center={[country.countryInfo.lat, country.countryInfo.long]}
//       color={casesTypeColors[casesType].hex}
//       fillColor={casesTypeColors[casesType].hex}
//       fillOpacity={0.4}
//       radius={
//         Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
//       }
//     >
//       <Popup>
//         <div className="info-container">
//           <div
//             className="info-flag"
//             style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
//           ></div>
//           <div className="info-name">{country.country}</div>
//           <div className="info-confirmed">
//             Cases: {numeral(country.cases).format("0,0")}
//           </div>
//           <div className="info-recovered">
//             Recovered: {numeral(country.recovered).format("0,0")}
//           </div>
//           <div className="info-deaths">
//             Deaths: {numeral(country.deaths).format("0,0")}
//           </div>
//         </div>
//       </Popup>
//     </Circle>
//   ));
