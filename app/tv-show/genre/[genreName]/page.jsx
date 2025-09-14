// app/tv-show/genre/[genreName]/page.jsx
import { notFound } from 'next/navigation';
import {
  getTvSeriesByGenre,
  getTvSeriesGenres,
} from '../../../../lib/api';
import TvSeriesList from '../../../../components/TvSeriesList';
import Link from 'next/link';
import Image from 'next/image';

// Utility untuk membuat slug dari nama genre yang SEO-Friendly.
const createGenreSlug = (name) => {
  if (!name) return '';
  // Menghapus karakter non-alphanumeric (kecuali spasi dan tanda hubung)
  // dan mengganti spasi menjadi tanda hubung tunggal.
  // Ini akan mengubah "Action & Adventure" menjadi "action-adventure"
  // dan "War & Politics" menjadi "war-politics".
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
};

export async function generateMetadata({ params }) {
  // Menggunakan await params agar sesuai dengan praktik terbaru Next.js
  const { genreName } = await params;

  const genres = await getTvSeriesGenres();

  // Memproses slug URL dari genreName agar konsisten
  const processedUrlSlug = createGenreSlug(genreName);

  // Mencari genre yang sesuai dari daftar genre API menggunakan slug yang sudah diproses
  const genre = genres.find(g => createGenreSlug(g.name) === processedUrlSlug);

  // Menyiapkan judul dan deskripsi metadata
  const title = genre?.name || 'Unknown Genre';
  const pageUrl = `https://fmoviestream.netlify.app/tv-show/genre/${processedUrlSlug}`; // Menggunakan processedUrlSlug untuk tautan
  const imageUrl = 'https://live.staticflickr.com/65535/54783431146_cea3af132d_b.jpg'; // Contoh URL gambar placeholder

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
      site: '@WatchStream123', // Ganti dengan handle Twitter Anda jika ada
      creator: '@WatchStream123',
      title: `Fmovies Stream - ${title} TV Series`,
      description: `Find and watch the best ${title} TV series for free on Fmovies Stream.`,
      images: [imageUrl],
    },
    other: {
      'fb:app_id': '100074345305108', // Ganti dengan ID aplikasi Facebook Anda jika ada
    },
  };
}

export default async function TvSeriesByGenrePage({ params }) {
  // Menggunakan await params agar sesuai dengan praktik terbaru Next.js
  const { genreName } = await params;

  const genres = await getTvSeriesGenres();

  // Memproses slug URL dari genreName agar konsisten
  const processedUrlSlug = createGenreSlug(genreName);

  // Mencari genre yang sesuai dari daftar genre API menggunakan slug yang sudah diproses
  const genre = genres.find(g => createGenreSlug(g.name) === processedUrlSlug);

  const genreId = genre?.id;
  const genreTitle = genre?.name || 'Unknown Genre';

  // Jika genre tidak ditemukan setelah pemrosesan slug
  if (!genreId) {
    // Menampilkan halaman 'not found' dengan tautan kembali ke beranda
    return (
      <div className="container mx-auto px-4 py-8 text-center text-white">
        <h1 className="text-3xl sm:text-4xl font-bold text-red-400 mb-4">Genre not found.</h1>
        <p className="text-lg">The requested TV series genre could not be found.</p>
        <Link href="/">
          <button className="mt-6 bg-blue-700 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">
            Go back to Home
          </button>
        </Link>
      </div>
    );
  }

  // Mendapatkan serial TV berdasarkan genreId yang ditemukan
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
