import * as React from 'react'
import { graphql } from 'gatsby'
import { useState } from 'react';
import Layout from '../components/layout'
import DynamicTable from '../components/dynamicTable';
import GenerateFilter from '../components/generateFilter';
import Select from 'react-select';
import dataQuery from '../components/dataQuery';

const ExcelPage = ({ data }) => {
    const nodes = data.movies.nodes;
    const [table, setTable] = useState(nodes);
    const [selected, setSelected] = useState(null);
    const filter = GenerateFilter({data});

    return (
      <div>
        <Layout pageTitle = "Movies :)">
            <Select
              options={filter}
              isMulti
              closeMenuOnSelect={false}
              isSearchable
              placeholder={"Filter Movies"}
              onChange={(e) => setSelected(e)}
            />
            <br/>
            <button onClick={() => setTable(dataQuery(selected, {data}))}>Set Filter</button>
            <DynamicTable nodes={table}/>
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
            id
          }
        }
        second: allMovieMovieMoviesXlsxMasterlist(
          filter: {Genre: {eq: "Animated"}, Year: {gte: 1995, lte: 2000}}
        ) {
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
            id
          }
        }    
    }`
export default ExcelPage