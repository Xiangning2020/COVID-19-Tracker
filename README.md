# COVID-19 Tracker

This project is a basic tracker which gives the real time COVID-19 data of different countries all over the world in the forms of statistics, table, map and line graphs. 

Website is [here](https://covid-19-tracker-xiangning.web.app/).

![image](https://github.com/Xiangning2020/COVID-19-Tracker/blob/master/covid_worldwide.png)


Users can click the country on the map to get the detailed data. For example:

Choose S.Korea and click on the map. Users can see the change of the data from the three cards above, the worldwide line graph.
![image](https://github.com/Xiangning2020/COVID-19-Tracker/blob/master/covid_Korea.png)

Let's try other countries.
![image](https://github.com/Xiangning2020/COVID-19-Tracker/blob/master/covid_Singapore.png)
![image](https://github.com/Xiangning2020/COVID-19-Tracker/blob/master/covid_iceland.png)

Thanks very much for the instruction of [Clever Programmer](https://www.youtube.com/channel/UCqrILQNl5Ed9Dz6CGMyvMTQ).

## What are the functionalities of this project?

- [x] Designed three cards to show the corresponding new, recovered and death cases both daily and in total given a
selected country from a menulist.
- [x] Represented the cases of each country on a map by drawing different sized and colored circles, centered and zoomed
in the map to the position of a country when it’s selected.
- [x] Implemented responsive pop-ups to display the country’s flag, the data of total, recovered, and death cases for users
when a country is clicked on the map by utilizing Leaflet.js.
- [x] Visualized the worldwide COVID-19 cases through tables and line graphs by using Chart.js and disease.sh API to
fetch the data.



## How to start?

Download all the files except the Firebase related part, since you can deploy it in your own firebase related account!
Also you may have to change the firebase related code in the files。

In the project directory, you can run:

`npm install` and `npm start` to see the effect of the website on your local computer.

