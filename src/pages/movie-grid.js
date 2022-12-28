import * as React from 'react'
import { graphql } from 'gatsby'
import { useState } from 'react';
import Layout from '../components/layout'
import MovieGrid from '../components/movieGrid';
import GenerateFilter from '../components/generateFilter';
import Select from 'react-select';
import dataQuery from '../components/dataQuery';
import {reactGrid, reactSelectContainer} from '../components/layout.module.css'
import { Row, Col } from 'react-grid-system';
import SearchField from 'react-search-field';

function searchFilter(text, data) {
  var newData = [];
  for (let index of data) {
    if (
      index.Movie.toLowerCase().includes(text.toLowerCase()) || 
      index.Actors.toLowerCase().includes(text.toLowerCase()) ||
      index.Director.toLowerCase().includes(text.toLowerCase()) ||
      index.Universe.toLowerCase().includes(text.toLowerCase()) ||
      index.Sub_Universe.toLowerCase().includes(text.toLowerCase())
    ) {
      newData.push(index);
    }
  }
  return newData;
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
      if (typeof(nodes[index].Ratings) !== "string") {
        try {
          nodes[index].Ratings = JSON.parse(nodes[index].Ratings.replace(/'/g, '"'))
        }
        catch (err) {
            console.log(nodes[index])
        }
      }
  }

    const [table, setTable] = useState(nodes);
    const [selected, setSelected] = useState(null);
    const filter = GenerateFilter({data});

    return (
      <div>
        <Layout pageTitle = "Movies :)">
          <Row className={reactGrid}>
            <Col lg={3} md={4} style={{textAlign:"center"}}>
              <SearchField
                placeholder='Search for Title, Actor, Director...'
                onChange={(value) => searchFilter(value, dataQuery(selected, { data })).length !== 0 ? setTable(searchFilter(value, dataQuery(selected, { data }))) : setTable(nodes)}
              />
            </Col>
            <Col lg={6} md={5}>
              <Select
                className={reactSelectContainer}
                classNamePrefix="react-select"
                options={filter}
                isMulti
                closeMenuOnSelect={false}
                isSearchable
                placeholder={"Filter Movies"}
                onChange={(e) => setSelected(e)}
              />
            </Col>
            <Col sm={3}>
              <button onClick={() => setTable(dataQuery(selected, { data }))}>Set Filter</button>
            </Col>
          </Row>
          <Row>
            <MovieGrid nodes={table}/>
          </Row>
        </Layout>
      </div>
    )
}

export const query = graphql`
    query  {
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
      movies: allMovieMovieMoviesXlsxMasterlist {
        nodes {
          Movie
          Score
          Universe
          Sub_Universe
          Genre
          Genre_2
          Exclusive
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
    }`
export default GridPage