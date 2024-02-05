/* eslint-disable react/prop-types */
import { useState } from "react";
import { get24HourTimeFromDate } from "../../utils/dateHelpers";
import { Modal } from "antd";
import "./flightCard.css";
import { useScreen } from "../../hooks/useScreen";

const FlightCard = (props) => {
  const { airline, key, flight } = props;
  const { airlineName, airlineCode, flightNumber } = airline;
  const { displayData } = flight;
  const { source, destination, totalDuration, stopInfo } = displayData;
  const [booking, setBooking] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const { isMobile } = useScreen();

  const handleBooking = () => {
    setSelectedFlight(flight);
    setBooking(!booking);
  };

  return (
    <div
      key={key}
      className={
        isMobile ? "flight-details-wrapper-mobile" : "flight-details-wrapper"
      }
    >
      {isMobile ? (
        <div className="airline-info-mobile">
          <div className="airline-info">
            <div className="airline-icon"></div>
            <div className="info-wrapper">
              <div className="airline-name">{airlineName}</div>
              <div className="airline-code">
                {airlineCode}-{flightNumber}
              </div>
            </div>
          </div>
          {isMobile && <div className="price">&#8377; {flight?.fare}</div>}
        </div>
      ) : (
        <div className="airline-info">
          <div className="airline-icon"></div>
          <div className="info-wrapper">
            <div className="airline-name">{airlineName}</div>
            <div className="airline-code">
              {airlineCode}-{flightNumber}
            </div>
          </div>
        </div>
      )}
      <div className="place-time">
        <div className="info-wrapper">
            <div className="time">{get24HourTimeFromDate(source?.depTime)}</div>
            <div className="place">{source?.airport?.cityName}</div>
        </div>
        <div className="info-wrapper">
            <div className="time">{totalDuration}</div>
            <div className="place">{stopInfo}</div>
        </div>
        <div className="info-wrapper">
            <div className="time">
            {get24HourTimeFromDate(destination?.arrTime)}
            </div>
            <div className="place">{destination?.airport?.cityName}</div>
        </div>
      </div>
      <div className={isMobile ? "price-info-mobile" : "price-info"}>
        {!isMobile && <div className="time">&#8377; {flight?.fare}</div>}
        <button className="button" onClick={() => handleBooking()}>
          Book now
        </button>
      </div>
      <Modal
        key={selectedFlight?.id}
        title="Confirm Booking"
        open={booking}
        onOk={() => setBooking(!booking)}
        onCancel={() => setBooking(!booking)}
        style={{ width: "400px" }}
        footer={null}
      >
        {/* <div>{airlineName}</div> */}
      </Modal>
    </div>
  );
};

export default FlightCard;
