import type { Movie, SearchParams } from "./types"

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

// Function to simulate keyword search
export async function searchMovies(params: SearchParams): Promise<Movie[]> {
  // In a real application, this would make an API call to your backend
  // For demonstration, we'll filter the mock data based on the search parameters

  let results = [...mockMovies]

  // Apply query filter
  if (params.query) {
    const query = params.query.toLowerCase()

    if (params.type === "keyword") {
      // Keyword search - match title, overview, genres, etc.
      results = results.filter(
        (movie) =>
          movie.title.toLowerCase().includes(query) ||
          movie.overview.toLowerCase().includes(query) ||
          (typeof movie.genres === "string" && movie.genres.toLowerCase().includes(query)) ||
          (movie.director && movie.director.toLowerCase().includes(query)) ||
          (typeof movie.cast === "string" && movie.cast.toLowerCase().includes(query)),
      )
    } else {
      // Semantic search - simulate by matching related concepts
      // In a real app, this would use vector embeddings and similarity search
      const semanticKeywords: Record<string, string[]> = {
        alien: ["space", "extraterrestrial", "invasion", "planet", "galaxy"],
        superhero: ["avengers", "marvel", "powers", "save", "hero"],
        future: ["dystopian", "technology", "advanced", "world", "society"],
        adventure: ["journey", "quest", "discover", "exploration", "travel"],
        war: ["battle", "fight", "conflict", "army", "soldier"],
        love: ["romance", "relationship", "passion", "heart", "emotion"],
      }

      // Find semantic matches
      const relevantKeywords: string[] = []
      Object.entries(semanticKeywords).forEach(([key, values]) => {
        if (query.includes(key) || values.some((v) => query.includes(v))) {
          relevantKeywords.push(key, ...values)
        }
      })

      if (relevantKeywords.length > 0) {
        results = results.filter((movie) =>
          relevantKeywords.some(
            (keyword) =>
              movie.title.toLowerCase().includes(keyword) ||
              movie.overview.toLowerCase().includes(keyword) ||
              (typeof movie.genres === "string" && movie.genres.toLowerCase().includes(keyword)),
          ),
        )
      } else {
        // Fallback to keyword search if no semantic matches
        results = results.filter(
          (movie) => movie.title.toLowerCase().includes(query) || movie.overview.toLowerCase().includes(query),
        )
      }
    }
  }

  // Apply filters
  if (params.filters) {
    // Filter by genres
    if (params.filters.genres && params.filters.genres.length > 0) {
      results = results.filter((movie) => {
        const movieGenres = typeof movie.genres === "string" ? movie.genres.split(", ") : movie.genres || []

        return params.filters?.genres?.some((genre) =>
          typeof movieGenres === "string" ? movieGenres.includes(genre) : movieGenres.some((g) => g.includes(genre)),
        )
      })
    }

    // Filter by year
    if (params.filters.year) {
      if (params.filters.year.min) {
        results = results.filter((movie) => {
          const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 0
          return year >= (params.filters?.year?.min || 0)
        })
      }

      if (params.filters.year.max) {
        results = results.filter((movie) => {
          const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 0
          return year <= (params.filters?.year?.max || 9999)
        })
      }
    }

    // Filter by rating
    if (params.filters.rating && params.filters.rating.min) {
      results = results.filter((movie) => {
        const rating = movie.vote_average || movie.imdb_rating || 0
        return rating >= (params.filters?.rating?.min || 0)
      })
    }
  }

  // Sort by relevance score (in a real app, this would be calculated by the search engine)
  results.sort((a, b) => (b.score || 0) - (a.score || 0))

  // Apply size limit
  if (params.size && params.size > 0) {
    results = results.slice(0, params.size)
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return results
}

// Function to get a movie by ID
export async function getMovieById(id: string): Promise<Movie | null> {
  // In a real application, this would make an API call to your backend
  const movie = mockMovies.find((movie) => movie.id === id)

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return movie || null
}
