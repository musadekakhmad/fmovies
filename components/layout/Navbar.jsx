// components/layout/Navbar.jsx

"use client";

import Link from 'next/link';
import { FaVideo, FaChevronDown } from 'react-icons/fa';
import { getMovieGenres, getTvSeriesGenres } from '../../lib/api';
import SearchBar from '../SearchBar';
import { useEffect, useState } from 'react';

// Reusable class for dropdown items for consistency
const dropdownItemClass = "block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200";

// Reusable class for sub-dropdown triggers
const subDropdownTriggerClass = "flex justify-between items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 cursor-pointer";

// Utility function to create a slug from a genre name
const createSlug = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

export default function Navbar() {
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [fetchedMovieGenres, fetchedTvGenres] = await Promise.all([
          getMovieGenres(),
          getTvSeriesGenres()
        ]);
        setMovieGenres(fetchedMovieGenres);
        setTvGenres(fetchedTvGenres);
      } catch (error) {
        console.error("Error fetching genres in Navbar:", error);
      }
    };
    fetchGenres();
  }, []);

  const DropdownMenu = ({ title, categories, genres, genrePathPrefix }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isGenresOpen, setIsGenresOpen] = useState(false);
    let timeoutId;

    const handleMouseEnter = () => {
      clearTimeout(timeoutId);
      setIsOpen(true);
    };

    const handleMouseLeave = () => {
      timeoutId = setTimeout(() => {
        setIsOpen(false);
        setIsGenresOpen(false); // Pastikan sub-dropdown juga tertutup
      }, 100); // Penundaan 100ms
    };

    // Handler khusus untuk sub-dropdown Genres
    const handleGenresMouseEnter = () => {
      setIsGenresOpen(true);
    };

    const handleGenresMouseLeave = () => {
      setIsGenresOpen(false);
    };

    return (
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className="flex items-center text-white hover:text-red-500 transition-colors duration-200 font-bold"
        >
          {title} <FaChevronDown className={`ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg z-20">
            <div className="py-1">
              {categories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className={dropdownItemClass}
                  onClick={() => setIsOpen(false)} // Close parent dropdown on item click
                >
                  {category.label}
                </Link>
              ))}
              {genres.length > 0 && (
                <div
                  className="relative"
                  onMouseEnter={handleGenresMouseEnter}
                  onMouseLeave={handleGenresMouseLeave}
                >
                  <button className={subDropdownTriggerClass}>
                    Genres <FaChevronDown className={`ml-1 transition-transform duration-200 ${isGenresOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isGenresOpen && (
                    <div className="absolute top-0 left-full mt-0 w-48 bg-slate-800 rounded-md shadow-lg z-30 ml-1">
                      <div className="py-1 max-h-60 overflow-y-auto">
                        {genres.map((genre) => (
                          <Link
                            key={genre.id}
                            // BARIS YANG TELAH DIPERBAIKI: Mengubah `/genre/` menjadi `/genre-`
                            href={`/${genrePathPrefix}/genre-${createSlug(genre.name)}`}
                            className={dropdownItemClass}
                            onClick={() => { setIsOpen(false); setIsGenresOpen(false); }} // Close all on item click
                          >
                            {genre.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="bg-slate-900 p-4 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/about" className="flex items-center text-white text-2xl font-bold hover:text-blue-400 transition-colors duration-200">
            <FaVideo className="text-red-500 mr-2" />
            <span>FMovies Stream</span>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-white hover:text-green-500 transition-colors duration-200 font-bold">
              Home
            </Link>
            <DropdownMenu
              title="Movies"
              categories={[
                { href: "/movie/popular", label: "Popular" },
                { href: "/movie/now_playing", label: "Now Playing" },
                { href: "/movie/upcoming", label: "Upcoming" },
                { href: "/movie/top_rated", label: "Top Rated" },
              ]}
              genres={movieGenres}
              genrePathPrefix="movie"
            />
            <DropdownMenu
              title="Tv Series"
              categories={[
                { href: "/tv-show/popular", label: "Popular" },
                { href: "/tv-show/airing_today", label: "Airing Today" },
                { href: "/tv-show/on_the_air", label: "On The Air" },
                { href: "/tv-show/top_rated", label: "Top Rated" },
              ]}
              genres={tvGenres}
              genrePathPrefix="tv-show"
            />
          </div>
        </div>
        {/* --- PERBAIKAN UNTUK KOTAK PENCARIAN --- */}
        <div className="flex items-center">
          <div className="w-72 md:w-80 lg:w-96"> {/* Kelas 'w-72' diubah menjadi w-72 untuk lebar default, dan kelas responsif ditambahkan */}
            <SearchBar />
          </div>
        </div>
        {/* ---------------------------------------- */}
      </div>
    </nav>
  );
}
