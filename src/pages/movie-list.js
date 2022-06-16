import * as React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import DynamicTable from '../components/dynamicTable';

const excelPage = ({ data }) => {
    const nodes = data.allMovieMovieMoviesXlsxMasterlist.nodes;
    return (
        <Layout pageTitle = "Movies :)">
            <DynamicTable nodes={nodes}></DynamicTable>
        </Layout>
    )
}

export const query = graphql`
    query  {
        allMovieMovieMoviesXlsxMasterlist {
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

export default excelPage