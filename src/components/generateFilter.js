import * as React from 'react';

export default function GenerateFilter({data}) {
  var genres = data.genre.distinct.concat(data.genre_two.distinct.filter((item) => data.genre.distinct.indexOf(item) < 0)).sort();
  var universes = data.universes.distinct;
  console.log(universes);
  console.log(genres);
  console.log(data);
  return genres;
}
