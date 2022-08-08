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
//need to merge genre with genre2
export const query = graphql`
    query  {
        genre: allMovieMovieMoviesXlsxMasterlist {
          distinct(field: Genre)
        }
        genre_two: allMovieMovieMoviesXlsxMasterlist(filter: {Genre_2: {ne: " "}}) {
          distinct(field: Genre_2)
        }
        years: allMovieMovieMoviesXlsxMasterlist {
          distinct(field: Year)
        }
        universes: allMovieMovieMoviesXlsxMasterlist(filter: {Universe: {ne: ""}}) {
          distinct(field: Universe)
        }
        sub_universes: allMovieMovieMoviesXlsxMasterlist(filter: {Sub_Universe: {ne: ""}}) {
          distinct(field: Sub_Universe)
        }
        exclusive: allMovieMovieMoviesXlsxMasterlist(filter: {Exclusive: {ne: ""}}) {
          distinct(field: Exclusive)
        }
        holiday: allMovieMovieMoviesXlsxMasterlist(filter: {Holiday: {ne: ""}}) {
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