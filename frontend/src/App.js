import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { Route } from "react-router-dom/cjs/react-router-dom.min";
import HomePage from "./components/HomePage";
import SpotDetails from "./components/SpotDetails";
import Bookings from "./components/Bookings";
import CreateNewSpot from "./components/CreateNewSpot";
import UserSpots from "./components/UserSpots";
import UpdateSpot from "./components/UpdateSpot";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/" component={HomePage} />
          {/* <Route path="/spots/:spotId/bookings" component={Bookings} /> */}
          <Route path="/spots/current" component={UserSpots} />
          <Route path="/spots/new" component={CreateNewSpot} />
          <Route path="/spots/:spotId/edit" component={UpdateSpot} />
          <Route path="/spots/:spotId" component={SpotDetails} />
        </Switch>
      )}
    </>
  );
}

export default App;
