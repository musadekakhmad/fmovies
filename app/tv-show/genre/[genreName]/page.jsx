// app/tv-show/genre/[genreName]/page.jsx
import { getTvSeriesByGenre, getTvSeriesGenres } from '../../../../lib/api';
import TvSeriesList from '../../../../components/TvSeriesList';

export async function generateMetadata({ params }) {
  // Await params sebelum mengakses propertinya
  const { genreName } = await params;

  const genres = await getTvSeriesGenres();
  
  // Mencari genre berdasarkan nama (slug) dari URL
  const genre = genres.find(g => g.name.toLowerCase().replace(/\s/g, '-') === genreName);
  const title = genre?.name || 'Unknown';
  
  const pageUrl = `https://fmoviestream.netlify.app/tv-show/genre/${genreName}`;
  const imageUrl = 'https://live.staticflickr.com/65535/54783431146_cea3af132d_b.jpg';

  return {
    title: `Fmovies Stream - ${title} TV Series`,
    description: `Find and watch the best ${title} TV series for free on Fmovies Stream.`,
    openGraph: {
      title: `Fmovies Stream - ${title} TV Series`,
      description: `Find and watch the best ${title} TV series for free on Fmovies Stream.`,
      url: pageUrl,
      siteName: 'Fmovies Stream',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} genre TV series poster`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@WatchStream123',
      creator: '@WatchStream123',
      title: `Fmovies Stream - ${title} TV Series`,
      description: `Find and watch the best ${title} TV series for free on Fmovies Stream.`,
      images: [imageUrl],
    },
    other: {
      'fb:app_id': '100074345305108',
    },
  };
}

export default async function TvSeriesByGenrePage({ params }) {
  // Await params sebelum mengakses propertinya
  const { genreName } = await params;
  
  const genres = await getTvSeriesGenres();
  
  // Mencari ID genre berdasarkan nama (slug) dari URL
  const genre = genres.find(g => g.name.toLowerCase().replace(/\s/g, '-') === genreName);
  const genreId = genre?.id;
  const genreTitle = genre?.name || 'Unknown';

  if (!genreId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-white">Genre not found.</p>
      </div>
    );
  }
  
  const series = await getTvSeriesByGenre(genreId);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">
        {genreTitle} TV Series
      </h1>
      {series && series.length > 0 ? (
        <TvSeriesList series={series} />
      ) : (
        <p className="text-center text-white">No TV series available in this genre.</p>
      )}
    </div>
  );
}
