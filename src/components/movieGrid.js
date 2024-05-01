import * as React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Link } from "gatsby";
import Gradient from "javascript-color-gradient";

export const PosterItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  padding: theme.spacing(1),
  textAlign: "center",
  color: "#0A0A0A",
  fontFamily: "Arial",
  height: "250px",
  width: "110px",
  fontSize: "13px",
}));

export const gradientArray = new Gradient()
  .setColorGradient("#FF0000", "#4CBB17")
  .setMidpoint(101)
  .getColors();

export default function MovieGrid({ nodes }) {
  return (
    <Grid container spacing={2.5}>
      {nodes.map((data) => {
        return (
          <Grid item xs={"auto"} key={data.id}>
            <Link
              to={`/movie-page?id=${data.TMDBId}`}
              state={{ from: data }}
              style={{ textDecoration: "none" }}
            >
              <PosterItem>
                <img
                  src={data.Poster}
                  height={163}
                  width={110}
                  alt="Not Found"
                />
                <div
                  style={{
                    color: gradientArray[data.Score],
                    fontWeight: "bolder",
                  }}
                >
                  {data.Score}/100
                </div>
                <div>{data.Movie}</div>
              </PosterItem>
            </Link>
          </Grid>
        );
      })}
    </Grid>
  );
}
