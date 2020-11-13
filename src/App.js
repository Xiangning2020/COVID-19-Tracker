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

function App() {
  //https://disease.sh/v3/covid-19/countries
  const [country, setCountry] = useState("worldwide");
  const [countries, setCountries] = useState([]);
  const [countryCases, setCountryCases] = useState({}); // 点击到那个国家，那个国家到数据；
  const [tableData, setTableData] = useState([]);
  // const [mapLat, setMapLat] = useState(34.7878);
  // const [mapLng, setMapLng] = useState(34.7878);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
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
      }));
      setCountries(countries);
      setMapData(data);
      setTableData(sortData(data)); // 这里直接引用的data.但是我们需要对data进行排序。
    };
    getCountriesData();
  }, []);

  // 只在一开始的时候跑一次；

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryCases(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]) &&
          setMapZoom(4);
      });
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
              onClick={onCountryChange}
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
          center={mapCenter}
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
