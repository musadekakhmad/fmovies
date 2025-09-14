// app/page.jsx

export const dynamic = 'force-dynamic';

import { getTrendingMoviesDaily, getTrendingTvSeriesDaily } from '../lib/api';
import MovieList from '../components/MovieList';
import TvSeriesList from '../components/TvSeriesList'; 
import Head from 'next/head';

export default async function Home() {
  // Fetch trending movie and TV series data in parallel
  const [trendingMovies, trendingTvSeries] = await Promise.all([
    getTrendingMoviesDaily(),
    getTrendingTvSeriesDaily()
  ]);

  return (
    <>
      <Head>
        <title>Fmovies Stream - Daily Trending</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">Daily Trending</h1>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-white">Trending Movies</h2>
          {trendingMovies.length > 0 ? (
            <MovieList movies={trendingMovies} />
          ) : (
            <p className="text-center text-white">No trending movies currently available.</p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-white">Trending TV Series</h2>
          {/* This TvSeriesList component needs to be created in the components folder */}
          {trendingTvSeries.length > 0 ? (
            <TvSeriesList series={trendingTvSeries} />
          ) : (
            <p className="text-center text-white">No trending TV series currently available.</p>
          )}
        </div>
      </div>
    </>
  );
}
