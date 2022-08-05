import * as React from 'react'
import { graphql } from 'gatsby'
import { useState } from 'react';
import Layout from '../components/layout'
import DynamicTable from '../components/dynamicTable';

const ExcelPage = ({ data }) => {
    const nodes = data.movies.nodes;
    const [table, setTable] = useState(nodes);

    return (
        <Layout pageTitle = "Movies :)">
            <button onClick={() => setTable(data.second.nodes)}>seriously, please don't click me</button>
            <DynamicTable nodes={table}></DynamicTable>
        </Layout>
    )
}

export const query = graphql`
    query  {
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
          filter: {Genre: {eq: "Animated"}, Year: {eq: 1995}}
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