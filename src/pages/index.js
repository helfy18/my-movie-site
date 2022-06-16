import * as React from 'react'
import Layout from '../components/layout'
import { StaticImage } from 'gatsby-plugin-image'

const IndexPage = () => {
  return (
    <Layout pageTitle="Home">
      <p>
        This will be the home page for my movie website.<br/>I am building this using the Gatsby
        tutorial.
      </p>
      <StaticImage 
        alt="a cute picture of the owl house"
        src="../images/owl-house.png"/>
      </Layout>
  )
}

export default IndexPage