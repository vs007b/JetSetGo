import { DatePicker, Select } from "antd";
import { useEffect, useState } from "react";

import FlightCard from "../FlightCard/FlightCard";
import FiltersCard from "../Filters/FiltersCard";
import callApi from '../../api/callApi';
import { GET_ALL_FLIGHTS } from '../../api/url';
import JetSetGoLogo from '../../assets/png/jet-set-go-logo.png'
import oppositeArrows from '../../assets/png/opposite-arrows.png'
import { convertHoursMinutesToSeconds, convertToAlphanumericDateFormat, extractDateFromDateAndTime } from "../../utils/dateHelpers";
import { useScreen } from "../../hooks/useScreen";

import "./home.css";

const { Option } = Select;

const Home = () => {
  const [flights, setFlights] = useState([]);
  const [travelDetails, setTravelDetails] = useState({
    source: "",
    destination: "",
    date: null
  });
  const [ filterDetails, setFilterDetails] = useState({})
  const [airportOptions, setAirportOptions] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [ flightsToSHow, setFlightsToShow] = useState([]);
  const { isMobile } = useScreen();

  const handleChange = (name) => (value) => {
    setTravelDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleDateChange = (date) => {

    setTravelDetails((prevState) => ({...prevState, date: date}));
  };

  const sortOnPrice = async () => {
    const updatedFlights = [...filteredFlights];
    if(filterDetails?.price === 'High'){
      updatedFlights.sort((a, b)=> b.fare - a.fare);
    }else{
      updatedFlights.sort((a, b)=> a.fare - b.fare);
    }
    return [...updatedFlights];
  }

  const sortOnDuration = async () => {
    const updatedFlights = [...filteredFlights];
    if(filterDetails?.duration === 'High'){
      updatedFlights.sort((a, b)=>{
        return(convertHoursMinutesToSeconds(b?.displayData?.totalDuration) - convertHoursMinutesToSeconds(a?.displayData?.totalDuration))
      });

    }else{
      updatedFlights.sort((a, b)=> {
        return(convertHoursMinutesToSeconds(a?.displayData?.totalDuration) - convertHoursMinutesToSeconds(b?.displayData?.totalDuration))
      });
    }
    return [...updatedFlights];
  }

  const getAirlinesFromAll = async () => {
    const updatedFlights = [];
    for(let i = 0; i < filteredFlights.length; i++){
      const { displayData } = filteredFlights[i];
      const { airlines } = displayData;
      for(let j = 0; j < airlines.length; j++){
        const { airlineName } = airlines[j];
        if(airlineName === filterDetails?.airline){
          updatedFlights.push(filteredFlights[i]);
        }
      }
    }
    return [...updatedFlights];
  }

  const getAirports = (flights) => {
    const airports = {};
    for (let i = 0; i < flights.length; i++) {
      const { displayData } = flights[i];
      const { source, destination } = displayData;
      const sourceAirport = {
        id: source?.airport?.airportCode,
        cityName: source?.airport?.cityName,
         
        airportCode: source?.airport?.airportCode,
        airportName: source?.airport?.airportName,
        countryCode: source?.airport?.countryCode,
        countryName: source?.airport?.countryName,
      };
      const destinationAirport = {
        id: destination?.airport?.airportCode,
        cityName: destination?.airport?.cityName,
        airportCode: destination?.airport?.airportCode,
        airportName: destination?.airport?.airportName,
        countryCode: destination?.airport?.countryCode,
        countryName: destination?.airport?.countryName,
      };
      airports[sourceAirport?.cityName] = sourceAirport;
      airports[destinationAirport?.cityName] = destinationAirport;
    }
    setAirportOptions(airports);
  };

  const searchFlights = () => {
    if(!travelDetails?.source || !travelDetails?.destination || !travelDetails?.date){
      alert('error');
      return;
    }

    const formattedDate = travelDetails?.date?.format('YYYY-MM-DD');
    const updatedFlights = [];
    for(let i = 0; i < flights.length; i++){
      const { displayData } = flights[i];
      const { source, destination } = displayData;
      const searchDate = extractDateFromDateAndTime(source?.depTime);
        if(travelDetails?.source === source?.airport?.cityName && travelDetails?.destination === destination?.airport?.cityName && searchDate === formattedDate){
            updatedFlights.push(flights[i]);
        }
    }
    setFilteredFlights(updatedFlights);
    setFlightsToShow(updatedFlights);
  }

  const clearFilters = () => {
    setFilterDetails({});

    setFlightsToShow(filteredFlights);
  }

  const getFilteredData = async () => {
    if(!filterDetails?.airline && !filterDetails?.duration && !filterDetails?.price){
      setFlightsToShow(filteredFlights);
    }
    if(filterDetails?.airline){
      const data = await getAirlinesFromAll();
      setFlightsToShow(data);
    }
    if(filterDetails?.duration){
      const data = await sortOnDuration();
      setFlightsToShow(data);
    }else if(filterDetails?.price){
      const data = await sortOnPrice();
      setFlightsToShow(data);
    }
  }

  const getAllFlightDetails = async () => {
    try {
      const response = await callApi({
          url: GET_ALL_FLIGHTS,
          method: 'GET',
      });
      const { data, message } = response;
      if(message === 'Success'){
        setFlights(data?.result);
        getAirports(data?.result);

      }
     
    } catch (error) {
        console.error({ message: 'Error- failed to get country code list' });
    }
  }

  const handleSwap = () => {
    setTravelDetails((prevState) => ({...prevState, source: prevState?.destination, destination: prevState?.source}))
  }

  useEffect(() => {
    getAllFlightDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(()=> {
    getFilteredData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[filterDetails]);

  return (
    <div className="app-wrapper">
      <div style={{gap: '20px'}} className="logo-wrapper flex-row">
        <img src={JetSetGoLogo} alt='logo' />
        <div style={{gap: '8px'}} className="flex-row">
          <div className="head">Jet</div>
          <div className="val">Set</div>
          <div className="head">Go</div>
        </div>
      </div>
      <div className="search-wrapper-card card">
        <div className={isMobile ? "search-parameters-wrapper-mobile" : "search-parameters-wrapper"}>
          <div className="from-input">
            <div className="heading">From</div>
            <div className="value-wrapper"> 
              <div className="value">
                {travelDetails?.source}
              </div>
              {travelDetails?.source && <div className="sub-value">
                {airportOptions[travelDetails?.source]?.airportCode}, {airportOptions[travelDetails?.source]?.airportName}
              </div>}
            </div>
            <Select
                style={{ width: "100%" }}
                showSearch
                placeholder="From"
                allowClear
                value={travelDetails.source}
                onChange={handleChange("source")}
              >
                {Object.keys(airportOptions)?.map((airport) => {
                  if (
                    travelDetails?.destination !== airportOptions[airport]?.cityName
                  ) {
                    return (
                      <Option
                        key={airportOptions[airport]?.id}
                        value={airportOptions[airport]?.cityName}
                      >
                        {airportOptions[airport]?.cityName}-
                        {airportOptions[airport]?.airportCode}
                      </Option>
                    );
                  }
                  return null;
                })}
              </Select>
          </div>
          <div className={isMobile ? "opposite-logo-mobile" : "opposite-logo"} onClick={() => handleSwap()}>
            <img src={oppositeArrows} alt="swap-logo" />
          </div>
          <div className="to-input">
            <div className="heading">To</div>
            <div className="value-wrapper">
              <div className="value">
                {travelDetails?.destination}
              </div>
              {travelDetails?.destination && <div className="sub-value">
                {airportOptions[travelDetails?.destination]?.airportCode}, {airportOptions[travelDetails?.destination]?.airportName}
              </div>}
            </div>
            <Select
                style={{ width: "100%" }}
                showSearch
                placeholder="Select Destination"
                allowClear
                value={travelDetails.destination}
                onChange={handleChange("destination")}
              >
                {Object.keys(airportOptions)?.map((airport) => {
                  if (travelDetails?.source !== airportOptions[airport]?.cityName) {
                    return (
                      <Option
                        key={airportOptions[airport]?.id}
                        value={airportOptions[airport]?.cityName}
                      >
                        {airportOptions[airport]?.cityName}-
                        {airportOptions[airport]?.airportCode}
                      </Option>
                    );
                  }
                  return null;
                })}
              </Select>
          </div>
          <div className="date-input">
            <div className="heading">On</div>
            <div className="value-wrapper">
              <div className="value">
              {convertToAlphanumericDateFormat(travelDetails?.date?.format('YYYY-MM-DD'))}
              </div>
            </div>
            <DatePicker style={{width: '100%'}} value={travelDetails?.date} onChange={handleDateChange} placeholder="Choose Date" />
          </div>
        </div>
        <div className="button-wrapper">
          <button className="button" onClick={() => searchFlights()}>Search</button>
        </div>
      </div>
      <div className={isMobile ? "filter-result-wrapper-mobile" : "filter-result-wrapper"}>
        <FiltersCard flights={flights} filterDetails={filterDetails} setFilterDetails={setFilterDetails} clearFilters={clearFilters}/>
        <div className="result-wrapper">
          {flightsToSHow?.length > 0 ? flightsToSHow?.map((flight) => (
              <div key={flight?.id} className="flight-list-wraper">
                {flight?.displayData.airlines?.map((airline) => (
                  <FlightCard key={airline?.airlineCode} airline={airline} flight={flight} />
                ))}</div>
          )): <div style={{marginTop: '40px',justifyContent:'space-around'}} className="flex-row">No Flights Available</div>}
        </div>
      </div>
    </div>
  );
};
export default Home;
