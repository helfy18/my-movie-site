import * as React from 'react'
import Layout from '../components/layout'

const AboutPage = () => {
  return (
    <Layout pageTitle="About">
        <p>
            Hello, our names are Johnathan and Dani, and we built this website to showcase our movie ratings.
            We will consistently be adding new ratings as we watch them.<br/><br/>
            Look out for site upgrades as well! Every Saturday morning MST there will be an update to the blog
            that shows the newly added movies to the site over the past week!
        </p>
    </Layout>
  )
}

export default AboutPage