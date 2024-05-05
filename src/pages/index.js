import * as React from "react";
import Layout from "../components/layout";

const IndexPage = () => {
  return (
    <Layout pageTitle="Home">
      <p>
        This will be the home page for my movie website.
        <br />
        <br />
        All of the content is found above at 'Movie Ratings'.
        <br />
        <br />
        <b>NOTE:</b> While I have critiques about these movies, I would like to
        acknowledge all of the work that goes into any of these films. People
        work very hard on even the smallest and "worst" films, and these people
        deserve credit for what they did. I would especially like to acknowledge
        the work of animators and vfx artists. These people are exceptionally
        overworked, and always do the best they can with the resources they are
        given. Even if I say that I don't like the animation of a movie, I do
        not blame this on the animators or VFX artists, and have an immense
        amount of respect for what they do.
      </p>
    </Layout>
  );
};

export default IndexPage;
