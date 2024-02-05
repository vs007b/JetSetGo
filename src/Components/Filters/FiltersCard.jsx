/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "./filtersCard.css";
import { Select, Radio, Button } from "antd";
import { useScreen } from "../../hooks/useScreen";

const { Option } = Select;

const FiltersCard = (props) => {
  const { flights, filterDetails, setFilterDetails, clearFilters } = props;
  const [airlineOptions, setAirlineOptions] = useState([]);
  const { isMobile } = useScreen();

  const handleCheckboxChange = (name) => (event) => {
    setFilterDetails((prevState) => ({
      airline: prevState.airline,
      [name]: event?.target?.value,
    }));
  };

  const options = [
    { label: "High first", value: "High" },
    { label: "Low first", value: "Low" },
  ];

  const getAirlines = () => {
    const newAirlines = {};
    for (let i = 0; i < flights.length; i++) {
      const { displayData } = flights[i];
      const { airlines } = displayData;
      for (let j = 0; j < airlines.length; j++) {
        const airlineName = airlines[j]?.airlineName;
        newAirlines[airlineName] = airlines[j]?.airlineName;
      }
    }
    setAirlineOptions(() => [...Object.keys(newAirlines)]);
  };

  const handleChange = (name) => (value) => {

    setFilterDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    getAirlines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flights]);

  return (
    <div className={isMobile ? "filters-wrapper-card-mobile" : "filters-wrapper-card"}>
      <div className="flex-row">
        <div className="input">
          <div>Airline:</div>
          <Select
            style={{ width: "200px" }}
            showSearch
            placeholder="Select Airline"
            allowClear
            value={filterDetails?.airline}
            onChange={handleChange("airline")}
          >
            {airlineOptions?.map((airlineName) => (
              <Option key={airlineName} value={airlineName}>
                {airlineName}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      <div className="flex-column">
        <div className="input">
          <div>Duration: </div>
          <Radio.Group
            onChange={handleCheckboxChange("duration")}
            value={filterDetails?.duration}
          >
            {options?.map((option) => (
              <Radio key={option?.label} value={option?.value}>
                {option?.label}
              </Radio>
            ))}
          </Radio.Group>
        </div>
        <div className="input">
          <div>Price: </div>
          <Radio.Group
            onChange={handleCheckboxChange("price")}
            value={filterDetails?.price}
          >
            {options?.map((option) => (
              <Radio key={option?.label} value={option?.value}>
                {option?.label}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      </div>
      <Button type="dashed" onClick={() => clearFilters()}>Clear filters</Button>

    </div>
  );
};

export default FiltersCard;
