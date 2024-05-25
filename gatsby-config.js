module.exports = {
  siteMetadata: {
    siteUrl: `https://jdmovies.gtsb.io/`,
    title: "JD Movies",
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`,
      },
    },
    {
      resolve: "gatsby-transformer-excel",
      options: {
        raw: false,
        defval: "",
      },
    },
  ],
};
