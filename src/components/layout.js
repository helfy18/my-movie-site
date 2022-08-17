import * as React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
import  { 
    container,
    heading,
    navLinks,
    navLinkItem,
    navLinkText,
    siteTitle,
  }  from './layout.module.css'

const Layout = ({ pageTitle, children }) => {
  const data = useStaticQuery(graphql`
    query {
        site {
            siteMetadata{
                title
            }
        }
    }
    `)
  return (
    <div className={container}>
      <title>{pageTitle} | {data.site.siteMetadata.title} </title>
      <header className={siteTitle}> 
        <StaticImage src="../images/nachos.png" height={50} alt=""/>
        <span/> {data.site.siteMetadata.title} <span/>
        <StaticImage src="../images/nachos.png" height={50} alt=""/>
      </header>
      <nav>
        <ul className={navLinks}>
          <li className={navLinkItem}>
            <Link to="/" className={navLinkText}>
              Home
            </Link>
          </li>
          <li className={navLinkItem}>
            <Link to="/about" className={navLinkText}>
              About
            </Link>
          </li>
          <li className={navLinkItem} hidden>
            <Link to="/blog" className={navLinkText}>
                Blog
            </Link>
          </li>
          <li className={navLinkItem}>
            <Link to="/movie-list" className={navLinkText}>
                Movie Ratings
            </Link>
          </li>
        </ul>
      </nav>
      <main>
        <h1 className={heading}>
            {pageTitle}
        </h1>
        {children}
      </main>
    </div>
  )
}

export default Layout