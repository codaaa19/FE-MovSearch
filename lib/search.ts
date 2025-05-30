import type { Movie, SearchParams as FrontendSearchParams, SearchFilters as FrontendSearchFilters } from "./types";
import api, { BackendQueryRequest, BackendKeywordSearchRequest, MovieSummaryRequestData, BackendSearchFilters } from "./api"

// Mock data for demonstration
const mockMovies: Movie[] = [
  {
    id: "828",
    title: "Muppets from Space",
    overview:
      "When Gonzo's breakfast cereal tells him that he's the descendant of aliens from another planet, his attempts at extraterrestrial communication get him kidnapped by a secret government agency, prompting the Muppets to spring into action. It's hard to believe Gonzo's story at first, but Kermit and friends soon find themselves on an epic journey into outer space filled with plenty of intergalactic misadventures.",
    release_date: "1999-07-14",
    vote_average: 6.1,
    popularity: 2.4696,
    genres: "Family, Science Fiction, Fantasy, Comedy",
    director: "Tim Hill",
    cast: "Hulk Hogan, Jack Angel, Peter Linz, Rob Schneider, Mark Sutton, Langley McArol, Andrew Stone, Josh Charles, Joshua Jackson, John E. Kennedy, BJ Guyer, Alice Dinnean, Steve Whitmire, Carl Espy, John Henson, Tyler Bunch, Allan Trautman, Chrissy Mullins, Adam Hunt, Kevin Clash, Lisa Sturz, Richard Fullerton, Bill Farmer, Bruce Lanoil, Deron Barnett, Kim Allen, Tim Parati, David Arquette, Greg Jarnigan, Elaine Nalee, Ray Liotta, Jerry Nelson, Rob Killen, Pamela O'Conner, Thom Stanley, Andie MacDowell, Joe Cobb Jr., Mickie McGowan, Evy Berman, Jeffrey Tambor, F. Murray Abraham, Rickey Boyd, Lisa Consolo, Bob Lynch, John Boone, Dennis W. Britt, James J. Kroupa, Bill Barretta, Mark Joy, Jay Tyson, Phil Proctor, Rowell Gormon, Drew Massey, Frank Oz, Dave Goelz, Gregg Wallace, Brian Henson, David Lenthall, Gary Owens, Rodger Bumpass, Katie Holmes, Veronica Alicino, Ed May, Pat Hingle, Kathy Griffin",
    poster_path: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/Aww9cF4uMsbald9ddhCYFoP4gBi.jpg",
    tagline: "Space. It's not as deep as you think.",
    runtime: 88,
    imdb_rating: 6.2,
    score: 12.669991,
  },
  {
    id: "770",
    title: "Parasyte: Part 2",
    overview:
      "Humanity is under attack by human-mimicking flesh-eating alien parasites. One parasite bonds with his young high school student host, and he convinces the parasite to help him stop the others.",
    release_date: "2015-04-25",
    vote_average: 7.078,
    popularity: 18.162,
    genres: "Science Fiction, Horror, Action, Drama",
    director: "Takashi Yamazaki",
    cast: "Jun Kunimura, Masahiro Higashide, Pierre Taki, Tadanobu Asano, Roy Kishima, Satoshi Araki, Shota Sometani, Ai Hashimoto, Kazuki Kitamura, Kimiko Yo, Takashi Yamanaka, Nao Ômori, Eri Fukatsu, Wataru Ichinose, Hirofumi Arai, Hideto Iwai, Sadawo Abe",
    poster_path: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/qO8zQ9dSADWiwRnR7oCOsPDuOom.jpg",
    tagline: "A constant battle of resistance.",
    runtime: 117,
    imdb_rating: 6.5,
    score: 1.3837525,
  },
  {
    id: "27205",
    title: "Inception",
    overview:
      "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: inception, the implantation of another person's idea into a target's subconscious.",
    release_date: "2010-07-16",
    vote_average: 8.4,
    popularity: 84.722,
    genres: "Action, Science Fiction, Adventure",
    director: "Christopher Nolan",
    cast: "Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page, Tom Hardy, Ken Watanabe, Dileep Rao, Cillian Murphy, Tom Berenger, Marion Cotillard, Pete Postlethwaite, Michael Caine, Lukas Haas",
    poster_path: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    tagline: "Your mind is the scene of the crime.",
    runtime: 148,
    imdb_rating: 8.8,
    score: 9.5,
  },
  {
    id: "157336",
    title: "Interstellar",
    overview:
      "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    release_date: "2014-11-05",
    vote_average: 8.4,
    popularity: 77.618,
    genres: "Adventure, Drama, Science Fiction",
    director: "Christopher Nolan",
    cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine, Mackenzie Foy, John Lithgow, Timothée Chalamet, David Oyelowo, Collette Wolfe, Francis X. McCarthy, Bill Irwin, Ellen Burstyn",
    poster_path: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    runtime: 169,
    imdb_rating: 8.6,
    score: 8.2,
  },
  {
    id: "603",
    title: "The Matrix",
    overview:
      "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
    release_date: "1999-03-30",
    vote_average: 8.2,
    popularity: 68.379,
    genres: "Action, Science Fiction",
    director: "Lana Wachowski, Lilly Wachowski",
    cast: "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving, Joe Pantoliano, Marcus Chong, Julian Arahanga, Matt Doran, Gloria Foster, Belinda McClory, Anthony Ray Parker, Paul Goddard",
    poster_path: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    tagline: "Welcome to the Real World.",
    runtime: 136,
    imdb_rating: 8.7,
    score: 7.8,
  },
  {
    id: "335984",
    title: "Blade Runner 2049",
    overview:
      "Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos. K's discovery leads him on a quest to find Rick Deckard, a former LAPD blade runner who has been missing for 30 years.",
    release_date: "2017-10-04",
    vote_average: 7.6,
    popularity: 47.932,
    genres: "Science Fiction, Drama",
    director: "Denis Villeneuve",
    cast: "Ryan Gosling, Harrison Ford, Ana de Armas, Sylvia Hoeks, Robin Wright, Mackenzie Davis, Carla Juri, Lennie James, Dave Bautista, Jared Leto, David Dastmalchian, Barkhad Abdi",
    poster_path: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    tagline: "The key to the future is finally unearthed.",
    runtime: 163,
    imdb_rating: 8.0,
    score: 6.9,
  },
  {
    id: "24428",
    title: "The Avengers",
    overview:
      "When an unexpected enemy emerges and threatens global safety and security, Nick Fury, director of the international peacekeeping agency known as S.H.I.E.L.D., finds himself in need of a team to pull the world back from the brink of disaster. Spanning the globe, a daring recruitment effort begins!",
    release_date: "2012-05-04",
    vote_average: 7.7,
    popularity: 92.515,
    genres: "Science Fiction, Action, Adventure",
    director: "Joss Whedon",
    cast: "Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth, Scarlett Johansson, Jeremy Renner, Tom Hiddleston, Clark Gregg, Cobie Smulders, Stellan Skarsgård, Samuel L. Jackson, Gwyneth Paltrow",
    poster_path: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
    tagline: "Some assembly required.",
    runtime: 143,
    imdb_rating: 8.0,
    score: 5.4,
  },
  {
    id: "299536",
    title: "Avengers: Infinity War",
    overview:
      "As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos. A despot of intergalactic infamy, his goal is to collect all six Infinity Stones, artifacts of unimaginable power, and use them to inflict his twisted will on all of reality. Everything the Avengers have fought for has led up to this moment - the fate of Earth and existence itself has never been more uncertain.",
    release_date: "2018-04-25",
    vote_average: 8.3,
    popularity: 158.308,
    genres: "Adventure, Action, Science Fiction",
    director: "Anthony Russo, Joe Russo",
    cast: "Robert Downey Jr., Chris Hemsworth, Mark Ruffalo, Chris Evans, Scarlett Johansson, Don Cheadle, Benedict Cumberbatch, Tom Holland, Chadwick Boseman, Zoe Saldana, Karen Gillan, Tom Hiddleston",
    poster_path: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
    tagline: "An entire universe. Once and for all.",
    runtime: 149,
    imdb_rating: 8.4,
    score: 4.7,
  },
  {
    id: "299534",
    title: "Avengers: Endgame",
    overview:
      "After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos' actions and restore order to the universe once and for all, no matter what consequences may be in store.",
    release_date: "2019-04-24",
    vote_average: 8.3,
    popularity: 200.723,
    genres: "Adventure, Science Fiction, Action",
    director: "Anthony Russo, Joe Russo",
    cast: "Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth, Scarlett Johansson, Jeremy Renner, Don Cheadle, Paul Rudd, Brie Larson, Karen Gillan, Danai Gurira, Benedict Wong",
    poster_path: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    tagline: "Part of the journey is the end.",
    runtime: 181,
    imdb_rating: 8.4,
    score: 4.2,
  },
  {
    id: "11",
    title: "Star Wars",
    overview:
      "Princess Leia is captured and held hostage by the evil Imperial forces in their effort to take over the galactic Empire. Venturesome Luke Skywalker and dashing captain Han Solo team together with the loveable robot duo R2-D2 and C-3PO to rescue the beautiful princess and restore peace and justice in the Empire.",
    release_date: "1977-05-25",
    vote_average: 8.2,
    popularity: 77.252,
    genres: "Adventure, Action, Science Fiction",
    director: "George Lucas",
    cast: "Mark Hamill, Harrison Ford, Carrie Fisher, Peter Cushing, Alec Guinness, Anthony Daniels, Kenny Baker, Peter Mayhew, David Prowse, James Earl Jones, Phil Brown, Shelagh Fraser",
    poster_path: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
    tagline: "A long time ago in a galaxy far, far away...",
    runtime: 121,
    imdb_rating: 8.6,
    score: 3.8,
  },
]

// Function to search movies (keyword or semantic)
export async function searchMovies(params: FrontendSearchParams): Promise<Movie[]> {
  const { query, size = 10, filters, type } = params;

  try {
    if (type === "semantic") {
      const backendFilters: BackendSearchFilters = {};
      if (filters?.year) {
        backendFilters.year = {};
        if (filters.year.min && filters.year.min > 0) backendFilters.year.min = filters.year.min;
        // Ensure year.max is considered if present
        if (filters.year.max && filters.year.max > 0 && filters.year.max >= (filters.year.min || 0)) {
            backendFilters.year.max = filters.year.max;
        }
      }
      // Backend expects 'vote_average' for rating filter in semantic search
      if (filters?.rating?.min !== undefined && filters.rating.min >= 0) { 
        backendFilters.vote_average = { min: filters.rating.min };
      }
      if (filters?.genres && filters.genres.length > 0) {
        backendFilters.genres = filters.genres;
      }

      const apiParams: BackendQueryRequest = {
        query,
        size,
        filters: Object.keys(backendFilters).length > 0 ? backendFilters : undefined,
        // min_score: can be added from params if needed for semantic search
      };
      return await api.semanticSearch(apiParams);
    } else { // Keyword search
      const apiParams: BackendKeywordSearchRequest = {
        query,
        size,
        // For keyword search, year_min, year_max, rating_min are top-level in the request body
        year_min: (filters?.year?.min && filters.year.min > 1900) ? filters.year.min : undefined,
        year_max: (filters?.year?.max && filters.year.max < new Date().getFullYear() + 1 ) ? filters.year.max : undefined,
        rating_min: (filters?.rating?.min !== undefined && filters.rating.min >= 0) ? filters.rating.min : undefined,
        genres: (filters?.genres && filters.genres.length > 0) ? filters.genres.join(',') : undefined,
      };
      return await api.keywordSearch(apiParams);
    }
  } catch (error) {
    console.error("Error searching movies:", error);
    // It might be better to throw the error or return a specific error object
    // instead of an empty array to allow the caller to handle it more gracefully.
    return [];
  }
}

// Function to get a movie by ID
export async function getMovieById(id: string): Promise<Movie | null> {
  try {
    return await api.getMovie(id);
  } catch (error) {
    console.error(`Error getting movie with ID ${id}:`, error);
    return null;
  }
}

// Function to get search summary
export async function getSearchSummary(movies: Movie[], query: string): Promise<string> {
  try {
    // Ensure the movies objects passed match the structure expected by the backend
    // (e.g., if backend expects MoviePydantic, ensure frontend Movie type is compatible)
    const requestBody: MovieSummaryRequestData = { movies, query }; 
    return await api.summarizeMovies(requestBody);
  } catch (error) {
    console.error("Error getting search summary:", error);
    return "Maaf, ringkasan AI tidak dapat dibuat saat ini."; // User-friendly error message
  }
}
