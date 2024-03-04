import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";
import Layout from "../components/layout";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Gradient from "javascript-color-gradient";
import { StaticImage } from "gatsby-plugin-image";
import { getProviderLink } from "../utils";

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
  const data = useStaticQuery(graphql`
    query {
      movies: allMovieMovieMoviesXlsxMasterlist {
        nodes {
          Movie
          Score
          Universe
          Sub_Universe
          Genre
          Genre_2
          Exclusive
          Studio
          Holiday
          Year
          Plot
          Poster
          Rated
          Ratings
          Review
          Runtime
          BoxOffice
          Actors
          Director
          Budget
          TMDBId
          id
          Provider
        }
      }
    }
  `);

  const tmdbId = new URLSearchParams(location.search).get("id");

  const currMovie = data.movies.nodes.filter(
    (movie) => movie.TMDBId === tmdbId
  )[0];

  const providers = JSON.parse(currMovie.Provider.replaceAll("'", '"'));

  return currMovie ? (
    <div>
      <Layout pageTitle="Movies :)">
        <Grid container spacing={2.5}>
          <Grid item xs textAlign="center">
            <img src={currMovie.Poster} width="275px" alt="Not Found"></img>
          </Grid>
          <Grid item sm={12} margin={"1rem"} md={5} marginTop={0}>
            <table id="infoTable" className="table">
              <tbody>
                <tr>
                  <td>Title</td>
                  <td>{currMovie.Movie}</td>
                </tr>
                <tr>
                  <td>Score</td>
                  <td
                    style={{
                      color: gradientArray[currMovie.Score],
                      fontWeight: "bolder",
                    }}
                  >
                    {currMovie.Score}/100
                  </td>
                </tr>
                {getUniverse(currMovie.Universe)}
                {getSubUniverse(currMovie.Sub_Universe)}
                {getGenres(currMovie)}
                {getExclusive(currMovie.Exclusive)}
                {getHoliday(currMovie.Holiday)}
                <tr>
                  <td>Year</td>
                  <td>{currMovie.Year}</td>
                </tr>
                <tr>
                  <td>MPA Rating</td>
                  <td>{currMovie.Rated}</td>
                </tr>
                <tr>
                  <td>Runtime</td>
                  <td>{currMovie.Runtime}</td>
                </tr>
                <tr>
                  <td>Budget</td>
                  <td>${currMovie.Budget}</td>
                </tr>
                <tr>
                  <td>Box Office</td>
                  <td>${currMovie.BoxOffice}</td>
                </tr>
                <tr>
                  <td>Actors</td>
                  <td>{currMovie.Actors}</td>
                </tr>
                <tr>
                  <td>Director</td>
                  <td>{currMovie.Director}</td>
                </tr>
                <tr>
                  <td>Studio</td>
                  <td>{currMovie.Studio}</td>
                </tr>
              </tbody>
            </table>
            <br />
            <table>
              <th colSpan={2}>Providers - Brought to You By JustWatch.com</th>
              <tbody>
                <tr key="stream">
                  <td>With Account</td>
                  <td>
                    {providers.flatrate?.map((provider) => {
                      return (
                        <a
                          href={getProviderLink(provider.provider_id)}
                          target="_blank"
                          style={{ paddingRight: "1rem" }}
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/w154/${provider.logo_path}`}
                            height={45}
                            alt="provider"
                          ></img>
                        </a>
                      );
                    })}
                  </td>
                </tr>
                <tr key="rent">
                  <td>For Rent</td>
                  <td>
                    {providers.rent?.map((provider) => {
                      return (
                        <a
                          href={getProviderLink(provider.provider_id)}
                          target="_blank"
                          style={{ paddingRight: "1rem" }}
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/w154/${provider.logo_path}`}
                            height={45}
                            alt="provider"
                          ></img>
                        </a>
                      );
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </Grid>
          <Grid
            item
            sm={12}
            margin={"1rem"}
            marginTop={0}
            lg
            textAlign="center"
          >
            <Item>
              Plot:
              <br />
              {currMovie.Plot}
            </Item>
            <br />
            {getReview(currMovie.Review)}
            <br />
            <table>
              <tbody>
                {JSON.parse(currMovie.Ratings.replaceAll("'", '"')).map(
                  (rating) => {
                    switch (rating["Source"]) {
                      case "Internet Movie Database":
                        return (
                          <tr key="imdb">
                            <td>
                              {" "}
                              <StaticImage
                                src="../images/imdb.png"
                                height={40}
                                alt=""
                              />
                            </td>
                            <td>{rating.Value}</td>
                          </tr>
                        );
                      case "Rotten Tomatoes":
                        return (
                          <tr key="rt">
                            <td>
                              {" "}
                              <StaticImage
                                src="../images/rt.png"
                                height={40}
                                alt=""
                              />
                            </td>
                            <td>{rating.Value}</td>
                          </tr>
                        );
                      case "Metacritic":
                        return (
                          <tr key="metacritic">
                            <td>
                              {" "}
                              <StaticImage
                                src="../images/metacritic.png"
                                height={40}
                                alt=""
                              />
                            </td>
                            <td>{rating.Value}</td>
                          </tr>
                        );
                      default:
                        return <Item></Item>;
                    }
                  }
                )}
              </tbody>
            </table>
          </Grid>
        </Grid>
        {console.log(
          JSON.stringify(
            JSON.parse(currMovie.Provider.replaceAll("'", '"')),
            null,
            2
          )
        )}
      </Layout>
    </div>
  ) : (
    "Not Found"
  );
};

export default MoviePage;
