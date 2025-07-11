import movieService from '../services/movie.service.js'
import {
  createMovieValidation,
  movieQueryValidation,
  updateMovieValidation,
} from '../validation/movie-validation.js'
import { requestValidate } from '../validation/validation.js'

const movieQueryParams = async (req, res, next) => {
  try {
    const query = requestValidate(movieQueryValidation, req.query)
    const result = await movieService.movieQueryParams(query)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}

const getMovieById = async (req, res, next) => {
  try {
    const result = await movieService.getMovieById(req.params.id)
    res.status(200).json({ data: result })
  } catch (err) {
    next(err)
  }
}

const createMovie = async (req, res, next) => {
  try {
    const body = requestValidate(createMovieValidation, req.body)

    const genres = Array.isArray(body.genres)
      ? body.genres.map((id) => parseInt(id))
      : [parseInt(body.genres)]

    const data = {
      ...body,
      durasi: body.durasi ? parseInt(body.durasi) : null,
      rating: body.rating ? parseFloat(body.rating) : null,
      genres,
    }

    const result = await movieService.createMovie(data, req.file)
    res.status(201).json({ data: result })
  } catch (err) {
    next(err)
  }
}

const updateMovie = async (req, res, next) => {
  try {
    const id = req.params.id
    const body = requestValidate(updateMovieValidation, req.body)

    const genres = body.genres
      ? Array.isArray(body.genres)
        ? body.genres.map((id) => parseInt(id))
        : [parseInt(body.genres)]
      : undefined

    const data = {
      ...body,
      durasi: body.durasi ? parseInt(body.durasi) : undefined,
      rating: body.rating ? parseFloat(body.rating) : undefined,
      genres,
    }

    const result = await movieService.updateMovie(id, data, req.file)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

const deleteMovie = async (req, res, next) => {
  try {
    const result = await movieService.deleteMovie(req.params.id)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}

export default { movieQueryParams, createMovie, getMovieById, updateMovie, deleteMovie }
