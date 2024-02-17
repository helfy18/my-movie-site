import * as React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import {
  container,
  navLinks,
  navLinkItem,
  navLinkText,
  siteTitle,
} from "./layout.module.css";

const Layout = ({ pageTitle, children }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);
  return (
    <div className={container}>
      <title>
        {pageTitle} | {data.site.siteMetadata.title}{" "}
      </title>
      <Link to="/" style={{ textDecoration: "none" }}>
        <header className={siteTitle}>
          <StaticImage src="../images/nachos.png" height={40} alt="" />
          <span />
          {data.site.siteMetadata.title} <span />
          <StaticImage src="../images/nachos.png" height={40} alt="" />
        </header>
      </Link>
      <nav>
        <ul className={navLinks}>
          <li className={navLinkItem}>
            <Link
              to="/"
              className={navLinkText}
              style={{ textDecoration: "none", color: "#008080" }}
            >
              Home
            </Link>
          </li>
          <li className={navLinkItem}>
            <Link
              to="/about"
              className={navLinkText}
              style={{ textDecoration: "none", color: "#008080" }}
            >
              About
            </Link>
          </li>
          <li className={navLinkItem}>
            <Link
              to="/blog"
              className={navLinkText}
              style={{ textDecoration: "none", color: "#008080" }}
            >
              Blog
            </Link>
          </li>
          <li className={navLinkItem}>
            <Link
              to="/movie-grid"
              className={navLinkText}
              style={{ textDecoration: "none", color: "#008080" }}
            >
              Movie Ratings
            </Link>
          </li>
        </ul>
      </nav>
      <main>{children}</main>
      <img
        src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
        height={50}
        style={{ paddingTop: "1rem" }}
        alt="TMDB API"
      ></img>
    </div>
  );
};

export default Layout;
