import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Register } from "./components/Register";
import { Dashboard } from "./components/Dashboard";
import { Navbar } from "./components/Navbar";
import { FQA } from "./components/fqa";
import { LeftComponent } from "./components/Left";
import { RightComponent } from "./components/Right";
import { Submissions } from "./components/Submission";
import { Rankings } from "./components/Rankings";
import { Problems } from "./components/Problems";
import { Account } from "./components/Account";
import { Problem } from "./components/Problem";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="flex">
        <LeftComponent />
        <div className="w-2/3 ml-4 mr-4">
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/register" component={Register} />
            <Route path="/submissions" component={Submissions} />
            <Route path="/fqa" component={FQA} />
            <Route path="/rankings" component={Rankings} />
            <Route path="/problems" component={Problems} />
            <Route path="/account" component={Account} />
            <Route path="/problem/:id" component={Problem} />
          </Switch>
        </div>
        <RightComponent />
      </div>
    </Router>
  );
}

export default App;
