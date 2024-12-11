import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import Home from "./Home";
import About from "./About";
import Service from "./Service";
import Contact from "./Contact";
import Footer from "./Footer";
import { Route, Switch, Redirect } from "react-router-dom";
import Navbar from "./Navbar";
import SessionRecorder from "./SessionRecorder";
import RecordingsPage from "./RecordingsPage";
import { ColorProvider } from "./ColorProvider";

const App = () => {
  return (
    <ColorProvider>
      <SessionRecorder />
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/service" component={Service} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/recordings" component={RecordingsPage} />
        <Redirect to="/" />
      </Switch>
      <Footer />
    </ColorProvider>
  );
};

export default App;
