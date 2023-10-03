import * as React from "react";
import { graphql } from "gatsby";
import { useState } from "react";
import Layout from "../components/layout";
import MovieGrid from "../components/movieGrid";
import GenerateFilter from "../components/generateFilter";
import Select from "react-select";
import dataQuery from "../components/dataQuery";
import {
  reactGrid,
  reactSelectContainer,
  searchBar,
} from "../components/layout.module.css";
import { Row, Col } from "react-grid-system";
import SearchField from "react-search-field";
import { Slider, Grid } from "@mui/material";

function searchFilter(text, data) {
  var newData = [];
  for (let index of data) {
    if (
      index.Movie.toLowerCase().includes(text.toLowerCase()) ||
      index.Actors.toLowerCase().includes(text.toLowerCase()) ||
      index.Director.toLowerCase().includes(text.toLowerCase()) ||
      index.Universe.toLowerCase().includes(text.toLowerCase()) ||
      index.Sub_Universe.toLowerCase().includes(text.toLowerCase()) ||
      index.Studio.toLowerCase().includes(text.toLowerCase())
    ) {
      newData.push(index);
    }
  }
  return newData;
}

function selectedOptions(data, toAdd, label) {
  if (data) {
    data = data.filter((entry) => entry["category"] !== label);
  }
  return data ? data.concat(toAdd) : toAdd;
}

const GridPage = ({ data }) => {
  const nodes = data.movies.nodes;
  // Sort the data in descending score
  nodes.sort((a, b) => {
    return b.Score - a.Score;
  });
  // Parse the ratings from string to object
  for (let index in nodes) {
    //nodes[index] = Object.assign({"Overall Rank": i++}, nodes[index] );
    if (typeof nodes[index].Ratings !== "string") {
      try {
        nodes[index].Ratings = JSON.parse(
          nodes[index].Ratings.replace(/'/g, '"')
        );
      } catch (err) {
        console.log(nodes[index]);
      }
    }
  }

  const handleChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  function resetFilter() {
    setSelected([]);
    setSliderValue([0, 1000]);
    setTable(dataQuery([], { data }, sliderValue));
    setShowDropdown(false);
  }

  const [showDropdown, setShowDropdown] = useState(false);
  const [table, setTable] = useState(nodes);
  const [selected, setSelected] = useState(null);
  const filter = GenerateFilter({ data });
  const [sliderValue, setSliderValue] = useState([0, 1000]);

  function getSelected(type) {
    var defselected = [];
    selected
      ? selected.forEach((value) => {
          if (type.toLowerCase() === value.category.toLowerCase())
            defselected.push(value);
        })
      : (defselected = []);
    return defselected;
  }

  return (
    <div>
      <Layout pageTitle="Movies :)">
        <Row className={reactGrid}>
          <Col md={2}></Col>
          <Col md={4} style={{ textAlign: "center" }}>
            <SearchField
              classNames={searchBar}
              placeholder="Search for Title, Actor, Director..."
              onChange={(value) =>
                searchFilter(value, dataQuery(selected, { data }, sliderValue))
                  .length !== 0
                  ? setTable(
                      searchFilter(
                        value,
                        dataQuery(selected, { data }, sliderValue)
                      )
                    )
                  : setTable(nodes)
              }
            />
          </Col>
          <Col md={4}>
            <button
              style={{ borderRadius: "8px" }}
              onClick={() => {
                setShowDropdown(!showDropdown);
              }}
            >
              {showDropdown ? "Hide" : "Filters"} &#8597;
            </button>
          </Col>
        </Row>
        {showDropdown ? (
          <Grid
            container
            style={{
              marginBottom: "1rem",
              background: "#d4f0f0",
              paddingTop: "0.5rem",
            }}
          >
            <Grid
              xs={6}
              item={true}
              key={1}
              style={{
                marginBottom: "0.5rem",
                textAlign: "right",
                paddingRight: "0.5rem",
              }}
            >
              <button
                style={{ width: "40%", borderRadius: "8px" }}
                onClick={() => {
                  setShowDropdown(!showDropdown);
                  setTable(dataQuery(selected, { data }, sliderValue));
                }}
              >
                Apply
              </button>
            </Grid>
            <Grid
              xs={6}
              item={true}
              key={2}
              style={{ marginBottom: "0.5rem", paddingLeft: "0.5rem" }}
            >
              <button
                style={{ width: "40%", borderRadius: "8px" }}
                onClick={() => {
                  resetFilter();
                }}
              >
                Reset
              </button>
            </Grid>
            {filter.map((opt) => {
              if (!opt["Runtime"]) {
                return (
                  <Grid xs={12} md={6} item={true} key={`${opt["label"]}-12`}>
                    <div
                      key={`${opt["label"]}-select-picker`}
                      style={{ textAlign: "center" }}
                    >
                      {opt["label"]}
                    </div>
                    <Select
                      className={reactSelectContainer}
                      classNamePrefix="react-select"
                      defaultValue={getSelected(opt["label"])}
                      options={opt["options"]}
                      isMulti
                      closeMenuOnSelect={false}
                      isSearchable
                      placeholder={
                        opt["label"] === "Genre"
                          ? "Ex: Animated, Horror"
                          : `Ex: ${opt["options"][0]["label"]}`
                      }
                      onChange={(e) => {
                        setSelected((prevState) =>
                          selectedOptions(prevState, e, opt["label"])
                        );
                      }}
                    ></Select>
                  </Grid>
                );
              } else {
                return (
                  <Grid xs={12} md={6} item={true} key={`runtime-12`}>
                    <div key={`runtime-slider`} style={{ textAlign: "center" }}>
                      Runtime
                    </div>
                    <Slider
                      min={opt["Runtime"][0]}
                      max={opt["Runtime"][opt["Runtime"].length - 1]}
                      onChange={handleChange}
                      style={{
                        width: "95%",
                        marginLeft: "2.5%",
                        color: "#55CBCD",
                      }}
                      value={sliderValue}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(x) => {
                        return `${x} min`;
                      }}
                    />
                  </Grid>
                );
              }
            })}
          </Grid>
        ) : null}
        <Row>
          <MovieGrid nodes={table} />
        </Row>
      </Layout>
    </div>
  );
};

export const query = graphql`
  query {
    genre: allMovieMovieMoviesXlsxMasterlist {
      distinct(field: Genre)
    }
    genre_two: allMovieMovieMoviesXlsxMasterlist {
      distinct(field: Genre_2)
    }
    years: allMovieMovieMoviesXlsxMasterlist {
      distinct(field: Year)
    }
    universes: allMovieMovieMoviesXlsxMasterlist {
      distinct(field: Universe)
    }
    sub_universes: allMovieMovieMoviesXlsxMasterlist {
      distinct(field: Sub_Universe)
    }
    exclusive: allMovieMovieMoviesXlsxMasterlist {
      distinct(field: Exclusive)
    }
    holiday: allMovieMovieMoviesXlsxMasterlist {
      distinct(field: Holiday)
    }
    studio: allMovieMovieMoviesXlsxMasterlist {
      distinct(field: Studio)
    }
    rated: allMovieMovieMoviesXlsxMasterlist {
      distinct(field: Rated)
    }
    universes_together: allMovieMovieMoviesXlsxMasterlist {
      group(field: Universe) {
        totalCount
        fieldValue
        group(field: Sub_Universe) {
          totalCount
          fieldValue
        }
      }
    }
    genrealt: allMovieMovieMoviesXlsxMasterlist {
      group(field: Genre) {
        fieldValue
        totalCount
      }
    }
    genre2alt: allMovieMovieMoviesXlsxMasterlist {
      group(field: Genre_2) {
        fieldValue
        totalCount
      }
    }
    director: allMovieMovieMoviesXlsxMasterlist {
      group(field: Director) {
        fieldValue
        totalCount
      }
    }
    directors: allMovieMovieMoviesXlsxMasterlist {
      distinct(field: Director)
    }
    runtime: allMovieMovieMoviesXlsxMasterlist {
      distinct(field: Runtime)
    }
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
        id
      }
    }
  }
`;
export default GridPage;
