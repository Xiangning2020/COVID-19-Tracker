import "./App.css";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
import InfoBox from "./InfoBox.js";
import Map from "./Map.js";
import Table from "./Table.js";
import LineGraph from "./LineGraph.js";
import "./util.js";
import { sortData, prettyPrintStat } from "./util.js";
import "leaflet/dist/leaflet.css";
import numeral from "numeral";

function App() {
  //https://disease.sh/v3/covid-19/countries

  const [countries, setCountries] = useState([]); // 全部国家的名字；只跑一次
  const [country, setCountry] = useState("worldwide"); // 点击到哪个国家，国家的code
  const [countryCases, setCountryCases] = useState({}); // 点击到那个国家，那个国家到数据；
  const [tableData, setTableData] = useState([]);
  const [mapLat, setMapLat] = useState(34.7878);
  const [mapLng, setMapLng] = useState(104.389);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapData, setMapData] = useState([]); // 传入数据的时候要注意
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    const getWorldCases = async () => {
      let response = await fetch("https://disease.sh/v3/covid-19/all");
      let data = await response.json();
      setCountryCases(data);
    };
    getWorldCases();
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      let response = await fetch("https://disease.sh/v3/covid-19/countries");
      let data = await response.json(); // 并不是说await 返回了一个promise它返回的是一个response；
      // 但是犹豫我们这里，又放了一个await.所以就导致说，await 把它后面的这个又变成了一个promise；
      let countries = data.map((country) => ({
        name: country.country,
        value: country.countryInfo.iso2,
        cases: country.cases,
      })); // data 直接就是array 形式；
      console.log(data);
      setCountries(countries);
      setMapData(data);

      setTableData(sortData(data)); // 这里直接引用的data.但是我们需要对data进行排序。
    };
    getCountriesData();
  }, []);

  // 只在一开始的时候跑一次；

  const onCountryChange = async (e) => {
    let countryCode = e.target.value;
    setCountry(countryCode);

    const url =
      e.target.value === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}?strict=true`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountryCases(data);
        setMapZoom(4);
        setMapLat(data.countryInfo.lat);
        setMapLng(data.countryInfo.long);
        // setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      });

    // console.log(data);
    // console.log([data.countryInfo.lat, data.countryInfo.long]);
  };

  return (
    <div className="app">
      {/* 左半部分 */}
      <div className="app__left">
        {/* 标题部分 */}
        <div className="app__header">
          {/* 标题 */}
          <h1>COVID-19 Tracker</h1>
          {/* 下拉筛选框 */}
          <FormControl variant="outlined" className="app__dropdown">
            <Select
              value={country}
              onChange={onCountryChange}
              className="app__selector"
            >
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* 统计数据 */}
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirous Cases "
            cases={prettyPrintStat(countryCases.todayCases)}
            total={prettyPrintStat(countryCases.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryCases.todayRecovered)}
            total={prettyPrintStat(countryCases.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths "
            cases={prettyPrintStat(countryCases.todayDeaths)}
            total={prettyPrintStat(countryCases.deaths)}
          />
        </div>

        {/* map */}
        <Map
          casesType={casesType}
          data={mapData}
          center={[mapLat, mapLng]}
          zoom={mapZoom}
        />
      </div>

      {/* 后半部分 */}
      <Card className="app__right">
        <CardContent>
          <h2>Live cases by country </h2>
          {/* table */}
          <Table countries={tableData} />
          <h2 className="graph__title">Worldwide new {casesType}</h2>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
