const express = require("express")
const app = express()
const { initializeDatabase } = require("./db/db.connect");

app.use(express.json())

const Movie = require("./models/movie.models");
initializeDatabase();

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));


// const newMovie = {
//   title: "New Movie",
//   releaseYear: 2023,
//   genre: ["Drama"],
//   director: "Aditya Roy Chopra",
//   actors: ["Actor 1", "Actor 2"],
//   languages: "Hindi",
//   country: "India",
//   rating: 6.1,
//   plot: "A young man and women fall in love on a Australia trip.",
//   awards: "IFA Filmfare Awards",
//   posterUrl: "https://example.com/new-poster1.jpg",
//   trailerUrl: "https://example.com/new-trailer1.mp4"
// }

async function createMovie(newMovie) {
  try {
    const movie = new Movie(newMovie)
    const saveMovie = await movie.save()
    return saveMovie
  } catch (error) {
    throw error
  }
  
}

app.post("/movies", async(req, res) => {
  try {
    const savedMovie = await createMovie(req.body)
    res.status(201).json({message: "Movie added successfully.", movie: savedMovie })
  } catch (error) {
    res.status(500).json({error: "Failed to add movie"})
  }
})






//createMovie(newMovie)

//find a movie wioth a particular title

async function readMovieByTitlt(movieTitle){
  try{
    const movie = await Movie.findOne({title: movieTitle})
    return movie
  }catch(error){
     throw error
  }

}

app.get("/movies/:title",async(req,res)=> {
  try {
    const movie = await readMovieByTitlt(req.params.title)
    if(movie){
      res.json(movie)
    }else{
      res.status(404).json({error:"Movie not found"})
    }
  } catch (error) {
    res.status(500).json({error:"Failed to fetch movie."})
  }
})

// to get all the movies in the database..

async function readAllMovies(){
  try{
    const allMovies = await Movie.find()
    return allMovies
  } catch(error){
    throw error
  }
}

app.get("/movies", async(req, res) => {
  try{
    const movies = await readAllMovies()
    if(movies.length != 0){
      res.json(movies)
    }else{
      res.status(404).json({error: "No movie found."})
    }
  }catch{
    res.status(500).json({error: "Failed to fetch movies"})
  }
})

//get movie by director name
async function readMovieByDirector(directorName){
  try{
    const movieByDirector = await Movie.find({director: directorName })
    return movieByDirector
  }catch(error){
    console.log(error)
  }
}


app.get("/movies/director/:directorName",async(req, res)=> {
  try {
    const directorMovie = await readMovieByDirector(req.params.directorName)
    if(directorMovie.length != 0){
      res.status(200).json(directorMovie)
    }else{
      res.status(404).json({error: "No movie found"})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to fetch movie."})
  }
})


async function readMovieByGenre(theGenre) {
  try{
     const movieByGenre = await Movie.find({genre: theGenre})
     return movieByGenre
  }catch(error){
     console.log(error)
  }


}


app.get("/movies/genre/:genreName", async(req, res) => {
     try {
        const theGenreMovie = await readMovieByGenre(req.params.genreName)
        if(theGenreMovie.length != 0){
          res.status(200).json(theGenreMovie)
        }else{
          res.status(404).json({error: "No Movie found."})
        }
     } catch (error) {
      res.status(500).json({error: "Failed to fetch movies."})
     }
})

async function deleteMovie(movieId) {
     try {
        const deletedMovie = await Movie.findByIdAndDelete(movieId)
        return deletedMovie
     } catch (error) {
        console.log(error)
     }  
}

app.delete("/movies/:movieId", async (req, res) => {
  try {
    const deletedMovieActually = await deleteMovie(req.params.movieId)
    if(deletedMovieActually){
      res.status(200).json({message: "Movie deleted successfully.",deletedMovieActually})
    }
    
  } catch (error) {
    res.status(500).json({error: "Failed to delete a movie."})
  }
})

async function updateMovie(movieId, dataToUpdate) {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(movieId, dataToUpdate,{new: true})
    return updatedMovie
  } catch (error) {
    console.log("Error in updateing Movie rating", error);
  }
}


app.post("/movies/:movieId", async(req, res) => {
  try {
    const updatedMovie = await updateMovie(req.params.movieId, req.body)
    res.status(202).json({message: "Movie updated succesfully.", theUpdatedMovie: updatedMovie })
  } catch (error) {
    res.status(500).json({error: "failed to update movie."})
  }
})


const PORT = 3000
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`)
} )