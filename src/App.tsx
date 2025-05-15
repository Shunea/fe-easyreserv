import React from "react";
import { Routes, Route } from "react-router-dom";
import Content from "./components/Content";
import Layout from "./layout/Layout";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Cards from "./components/CreatePlace/Cards/Cards";
import Form from "./components/CreatePlace/Form/Form";
import Contacts from "./components/CreatePlace/Contacts/Contacts";
import ImagesGallery from "./components/CreatePlace/Images Gallery/ImagesGallery";
import Menu from "./components/Menu/Menu";
import MealSetup from "./components/MealSetup/MealSetup";
import StaffPage from "./components/Staff/StaffPage";
import Places from "./components/CreatePlace/Places";
import Reservations from "./components/Reservations/Reservations";
import Clients from "./components/Clients/Clients";
import RestaurantPage from "./components/Restaurant/RestaurantPage/RestaurantPage";
import Login from "./pages/logare/Login";
import ProtectedRoute from "./utils/protectedRoute";
import ForgotPassword from "./pages/logare/forgot-password";
import ResetPassword from "./pages/logare/reset-password";
import MainPage from "./pages/MainPage/MainPage";
import EmailVerification from "./pages/logare/email-verification";
import Register from "./pages/logare/register";
import OverviewCalendar from "./components/Staff/OverviewCalendar/OverviewCalendar";
import { ToastContainer } from "react-toastify";
import Dashboard from "./components/Dashboard/Dashboard";
import LoginBackground from "./images/LoginBackground.png";
import LoginPlacesBackground from "./images/LoginPlacesBackground.png";
import YourPlaces from "./pages/logare/places";
import Settings from "./components/Settings/Settings";
import Plans from "./components/CreatePlace/Plans/Plans";
import Stock from "./components/Stock/Stock";
import Communication from "./components/Communication/Communication";
import Notification from "./FireBaseNotification/Notification";
import ClientsStatistics from "./components/Statistics/clientsStatstics/ClientsStatistics";
import Transport from "./components/Transport/Transport";
import Statistics from "./components/Statistics/dashboard/Statistics";
import ReservationStatistics from "./components/Statistics/reservationStatistics/ReservationStatistics";
import Sales from "./components/Statistics/sales/Sales";
import Rating from "./components/Statistics/rating/Rating";
import ListView from "./components/Staff/ListView/ListView";
import Delivery from "./components/Delivery/Delivery";
import Receipt from "./components/Receipt/Receipt";
import Reporting from "./components/Reporting/Reporting";
import SalesReport from "./components/Reporting/SalesReport";
import DelaysReport from "./components/Reporting/DelaysReport";
import AccessControl from "./components/AccessControl/AccessControl";
const App: React.FC = () => {
  const targetDate = new Date("2024-12-31T00:00:00");

  return (
    <div>
      <Layout>
        <Routes>
          <Route
            path="/login"
            element={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100vh",
                  position: "relative",
                  background: `url(${LoginBackground}) center/cover no-repeat`,
                }}
              >
                <Login />
              </div>
            }
          />
          <Route
            path="/register"
            element={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100vh",
                  position: "relative",
                  background: `url(${LoginBackground}) center/cover no-repeat`,
                }}
              >
                <Register />
              </div>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100vh",
                  position: "relative",
                  background: `url(${LoginBackground}) center/cover no-repeat`,
                }}
              >
                <ForgotPassword />
              </div>
            }
          />
          <Route
            path="/reset-password/:tokenKey"
            element={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100vh",
                  position: "relative",
                  background: `url(${LoginBackground}) center/cover no-repeat`,
                }}
              >
                <ResetPassword />
              </div>
            }
          />
          <Route
            path="/email-verification/:tokenKey"
            element={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100vh",
                  position: "relative",
                  background: `url(${LoginBackground}) center/cover no-repeat`,
                }}
              >
                <EmailVerification />
              </div>
            }
          />
          <Route
            path="/your-places"
            element={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100vh",
                  position: "relative",
                  background: `url(${LoginPlacesBackground}) center/cover no-repeat`,
                }}
              >
                <YourPlaces />
              </div>
            }
          />
          <Route
            path="/"
            element={
              <Content>
                <ProtectedRoute>
                  <MainPage targetDate={targetDate} />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/create-place"
            element={
              <Content hasImage={true}>
                <ProtectedRoute>
                  <Cards />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/create-place/plans"
            element={
              <Content hasImage={false}>
                <ProtectedRoute>
                  <Plans />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/create-place/create"
            element={
              <Content hasImage={true}>
                <ProtectedRoute>
                  <Form isEditPlace={false} />
                </ProtectedRoute>
              </Content>
            }
          />
          {/* <Route
            path="/create-place/setup"
            element={
              <Content hasImage={true}>
                <ProtectedRoute>
                  <PlaceSetup />
                </ProtectedRoute>
              </Content>
            }
          /> */}
          <Route
            path="/create-place/contacts"
            element={
              <Content hasImage={true}>
                <ProtectedRoute>
                  <Contacts isEditPlace={false} />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/create-place/images"
            element={
              <Content hasImage={true}>
                <ProtectedRoute>
                  <ImagesGallery
                    isEditPlace={false}
                  />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/edit-place/create"
            element={
              <Content hasImage={true}>
                <ProtectedRoute>
                  <Form isEditPlace={true} />
                </ProtectedRoute>
              </Content>
            }
          />
          {/* <Route
            path="/edit-place/setup"
            element={
              <Content hasImage={true}>
                <ProtectedRoute>
                  <PlaceSetup isEditPlace={true} />
                </ProtectedRoute>
              </Content>
            }
          /> */}
          <Route
            path="/edit-place/contacts"
            element={
              <Content hasImage={true}>
                <ProtectedRoute>
                  <Contacts isEditPlace={true} />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/edit-place/images"
            element={
              <Content hasImage={true}>
                <ProtectedRoute>
                  <ImagesGallery
                    isEditPlace={true}
                  />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/places"
            element={
              <Content hasImage={true}>
                <ProtectedRoute>
                  <Places />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/reservations"
            element={
              <Content>
                <ProtectedRoute>
                  <Reservations />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/menu"
            element={
              <Content hasImage={false}>
                <ProtectedRoute>
                  <Menu />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/menu/mealSetup"
            element={
              <Content hasImage={true}>
                <ProtectedRoute>
                  <MealSetup />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/staff"
            element={
              <Content hasImage={false}>
                <ProtectedRoute>
                  <StaffPage />
                </ProtectedRoute>
              </Content>
            }
          ></Route>
          <Route
            path="/stock"
            element={
              <Content hasImage={false}>
                <ProtectedRoute>
                  <Stock />
                </ProtectedRoute>
              </Content>
            }
          ></Route>
          <Route
            path="/dashboard"
            element={
              <Content hasImage={false}>
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </Content>
            }
          ></Route>
          <Route
            path="/staff/overview-calendar"
            element={
              <Content hasImage={false}>
                <ProtectedRoute>
                  <OverviewCalendar />
                </ProtectedRoute>
              </Content>
            }
          ></Route>
          <Route
            path="/staff/list-view"
            element={
              <Content hasImage={false}>
                <ProtectedRoute>
                  <ListView />
                </ProtectedRoute>
              </Content>
            }
          ></Route>        
          <Route
            path="/restaurant"
            element={
              <Content>
                <ProtectedRoute>
                  <RestaurantPage />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/statistics"
            element={
              <Content>
                <ProtectedRoute>
                  <Statistics />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/statistics/clients"
            element={
              <Content>
                <ProtectedRoute>
                  <ClientsStatistics />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/statistics/reservations"
            element={
              <Content>
                <ProtectedRoute>
                  <ReservationStatistics />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/statistics/sales"
            element={
              <Content>
                <ProtectedRoute>
                  <Sales />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/statistics/rating"
            element={
              <Content>
                <ProtectedRoute>
                  <Rating />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/client"
            element={
              <Content>
                <ProtectedRoute>
                  <Clients />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reporting"
            element={
              <Content>
                <ProtectedRoute>
                  <Reporting />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/salesreport"
            element={
              <Content>
                <ProtectedRoute>
                  <SalesReport />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/delaysreport"
            element={
              <Content>
                <ProtectedRoute>
                  <DelaysReport />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/receipt"
            element={
              <Content>
                <ProtectedRoute>
                  <Receipt />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/communication"
            element={
              <ProtectedRoute>
                <Communication
                  clientStatus={""}
                  lastVisit={null}
                  // orderPriceFrom={""}
                  // orderPriceTo={""}
                  // orderCategory={""}
                  // timeOfTheDay={""}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transport"
            element={
              <Content>
                <ProtectedRoute>
                  <Transport />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/delivery"
            element={
              <Content>
                <ProtectedRoute>
                  <Delivery />
                </ProtectedRoute>
              </Content>
            }
          />
          <Route
            path="/access-control"
            element={
              <Content>
                <ProtectedRoute>
                  <AccessControl />
                </ProtectedRoute>
              </Content>
            }
          />
        </Routes>
        <Notification />
        <ToastContainer />
      </Layout>
    </div>
  );
};

export default App;
