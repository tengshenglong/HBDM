import React from "react";
import { Route, Switch } from "react-router-dom";
import WelcomePage from "../component/WelcomePage";
import ChartsPage from "../../business/charts/ChartsPage";
import TableDemo from "../../business/tables/TableDemo";
import StepPage from "../../business/steps/StepPage";
import UserPage from "../../business/user/UserPage";
import RolePage from "../../business/role/RolePage";
import ProPage from "../../business/pro/ProPage";
import MenuPage from "../../business/menus/MenuPage";
import InsPage from "../../business/industry/InsPage";
import FacilitatorPage from "../../business/facilitator/FacilitatorPage";
import OrderPage from "../../business/orders/OrderPage";
import IsvOrderPage from "../../business/orders/IsvOrderPage";
import OrderExport from "../../business/orders/OrderExport";
import RejectPage from "../../business/rejects/RejectPage";
import RejectReports from "../../business/rejects/RejectReports";
import RejectExport from "../../business/rejects/RejectExport";
import ProjectPage from "../../business/project/ProjectPage";
import UserSurvey from "../../business/userSurvey/UserSurvey";
import UserSurveyResult from "../../business/userSurveyResult/UserSurveyResult";
import BackHandle from "../../business/management/BackHandle";
import TimedTask from "../../business/tasks/TimedTask";

const Routes = () => (
  <Switch>
    <Route path="/" exact component={WelcomePage} />
    <Route path="/charts/CustomCharts" component={ChartsPage} />
    <Route path="/tables/TableDemo" component={TableDemo} />
    <Route path="/steps/StepPage" component={StepPage} />
    <Route path="/user/UserPage" component={UserPage} />
    <Route path="/role/RolePage" component={RolePage} />
    <Route path="/project/ProjectPage" component={ProjectPage} />
    <Route path="/menus/MenuPage" component={MenuPage} />
    <Route path="/pro/ProPage" component={ProPage} />
    <Route path="/industry/InsPage" component={InsPage} />
    <Route path="/facilitator/FacilitatorPage" component={FacilitatorPage} />
    <Route path="/orders/OrderPage" component={OrderPage} />
    <Route path="/orders/IsvOrderPage" component={IsvOrderPage} />
    <Route path="/orders/OrderExport" component={OrderExport} />
    <Route path="/rejects/RejectPage" component={RejectPage} />
    <Route path="/rejects/RejectReports" component={RejectReports} />
    <Route path="/rejects/RejectExport" component={RejectExport} />
    <Route path="/userSurvey/UserSurvey" component={UserSurvey} />
    <Route path="/userSurveyResult/UserSurveyResult" component={UserSurveyResult} />
    <Route path="/management/BackHandle" component={BackHandle} />
    <Route path="/tasks/TimedTask" component={TimedTask} />
    <Route render={() => <h1>找不到此页面</h1>} />
  </Switch>
);

export default Routes;
