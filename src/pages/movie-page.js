import * as React from "react";
import Layout from "../components/layout";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Gradient from "javascript-color-gradient";

function getGenres(data) {
  let genreString = data.Genre;
  if (data.Genre_2) {
    genreString += `, ${data.Genre_2}`;
  }
  return (
    <tr>
      <td>Genres</td>
      <td>{genreString}</td>
    </tr>
  );
}

function getSubUniverse(subUniverse) {
  if (subUniverse) {
    return (
      <tr>
        <td>Sub Universe</td>
        <td>{subUniverse}</td>
      </tr>
    );
  }
  return;
}

function getUniverse(universe) {
  if (universe) {
    return (
      <tr>
        <td>Universe</td>
        <td>{universe}</td>
      </tr>
    );
  }
  return;
}

function getExclusive(exclusive) {
  if (exclusive) {
    return (
      <tr>
        <td>Exclusive</td>
        <td>{exclusive}</td>
      </tr>
    );
  }
  return;
}

function getHoliday(holiday) {
  if (holiday) {
    return (
      <tr>
        <td>Holiday</td>
        <td>{holiday}</td>
      </tr>
    );
  }
  return;
}

function getReview(review) {
  if (review) {
    return (
      <Item>
        Review:
        <br />
        {review}
      </Item>
    );
  }
  return;
}

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "center",
  color: "#0A0A0A",
  fontFamily: "Arial",
  fontSize: "16px",
}));

const gradientArray = new Gradient()
  .setColorGradient("#FF0000", "#4CBB17")
  .setMidpoint(101)
  .getColors();

const MoviePage = ({ location }) => {
  if (location.state) {
    return (
      <div>
        <Layout pageTitle="Movies :)">
          <Grid container spacing={2.5}>
            <Grid item xs textAlign="center">
              <img
                src={location.state.from.Poster}
                width="275px"
                alt="Not Found"
              ></img>
            </Grid>
            <Grid item sm={12} margin={"1rem"} md={5} marginTop={0}>
              <table id="infoTable" className="table">
                <tbody>
                  <tr>
                    <td>Title</td>
                    <td>{location.state.from.Movie}</td>
                  </tr>
                  <tr>
                    <td>Score</td>
                    <td
                      style={{
                        color: gradientArray[location.state.from.Score],
                        fontWeight: "bolder",
                      }}
                    >
                      {location.state.from.Score}/100
                    </td>
                  </tr>
                  {getUniverse(location.state.from.Universe)}
                  {getSubUniverse(location.state.from.Sub_Universe)}
                  {getGenres(location.state.from)}
                  {getExclusive(location.state.from.Exclusive)}
                  {getHoliday(location.state.from.Holiday)}
                  <tr>
                    <td>Year</td>
                    <td>{location.state.from.Year}</td>
                  </tr>
                  <tr>
                    <td>MPA Rating</td>
                    <td>{location.state.from.Rated}</td>
                  </tr>
                  <tr>
                    <td>Runtime</td>
                    <td>{location.state.from.Runtime}</td>
                  </tr>
                  <tr>
                    <td>Budget</td>
                    <td>${location.state.from.Budget}</td>
                  </tr>
                  <tr>
                    <td>Box Office</td>
                    <td>${location.state.from.BoxOffice}</td>
                  </tr>
                  <tr>
                    <td>Actors</td>
                    <td>{location.state.from.Actors}</td>
                  </tr>
                  <tr>
                    <td>Director</td>
                    <td>{location.state.from.Director}</td>
                  </tr>
                  <tr>
                    <td>Studio</td>
                    <td>{location.state.from.Studio}</td>
                  </tr>
                </tbody>
              </table>
            </Grid>
            <Grid item sm={12} margin={"1rem"} marginTop={0} lg>
              <Item>
                Plot:
                <br />
                {location.state.from.Plot}
              </Item>
              <br />
              {getReview(location.state.from.Review)}
            </Grid>
          </Grid>
          {/* {JSON.stringify(location.state.from.Ratings, null, 2)} */}
        </Layout>
      </div>
    );
  } else {
    return <Layout></Layout>;
  }
};

export default MoviePage;
