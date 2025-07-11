import prisma from '../config/db.js'
import { ResponseError } from '../error/response-error.js'
import path from 'path'
import fs from 'fs'
import { requestValidate } from '../validation/validation.js'
import { movieQueryValidation } from '../validation/movie-validation.js'

const movieQueryParams = async (query) => {
  const request = await requestValidate(movieQueryValidation, query)

  const page = parseInt(request.page) || 1
  const limit = parseInt(request.limit) || 10
  const skip = (page - 1) * limit
  const sortOrder = request.sort || 'asc'
  const sortBy = request.sortBy || 'judul'
  const search = request.search || ''
  const genreFilter = request.genre

  const where = {
    ...(search && {
      judul: {
        contains: search,
      },
    }),
    ...(genreFilter && {
      filmGenres: {
        some: {
          genre: {
            nama: {
              equals: genreFilter,
            },
          },
        },
      },
    }),
  }

  const [total_item, movies] = await Promise.all([
    prisma.film.count({ where }),
    prisma.film.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        filmGenres: { include: { genre: true } },
      },
    }),
  ])

  return {
    data: movies,
    pagination: {
      page,
      total_item,
      total_pages: Math.ceil(total_item / limit),
      limit,
    },
  }
}

const getMovieById = async (id) => {
  return await prisma.film.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      filmGenres: {
        include: {
          genre: true,
        },
      },
    },
  })
}

const createMovie = async (data, file) => {
  if (!file) throw new ResponseError(400, 'File thumbnail wajib di-upload')

  return await prisma.film.create({
    data: {
      judul: data.judul,
      durasi: data.durasi,
      rating: data.rating,
      deskripsi: data.deskripsi,
      thumbnail: `/uploads/${file.filename}`,
      filmGenres: {
        create: data.genres.map((genreId) => ({
          genre: { connect: { id: genreId } },
        })),
      },
    },
    include: {
      filmGenres: {
        include: {
          genre: true,
        },
      },
    },
  })
}

const updateMovie = async (id, data, file) => {
  const movie = await prisma.film.findUnique({
    where: { id: parseInt(id) },
  })
  if (!movie) throw new ResponseError(404, 'Film tidak ditemukan')

  if (data.genres) {
    await prisma.filmGenre.deleteMany({ where: { filmId: parseInt(id) } })
  }

  if (file && movie.thumbnail) {
    const oldPath = path.join(process.cwd(), 'src', movie.thumbnail)
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath)
    }
  }

  return await prisma.film.update({
    where: { id: parseInt(id) },
    data: {
      judul: data.judul,
      durasi: data.durasi,
      rating: data.rating,
      deskripsi: data.deskripsi,
      thumbnail: file ? `/uploads/${file.filename}` : movie.thumbnail,
      updatedAt: new Date(),
      filmGenres: data.genres
        ? {
            create: data.genres.map((id) => ({
              genre: { connect: { id: id } },
            })),
          }
        : undefined,
    },
    include: { filmGenres: { include: { genre: true } } },
  })
}

const deleteMovie = async (id) => {
  const movie = await prisma.film.findUnique({
    where: { id: parseInt(id) },
  })
  if (!movie) throw new ResponseError(404, 'Film tidak ditemukan')

  await prisma.filmGenre.deleteMany({ where: { filmId: parseInt(id) } })

  if (movie.thumbnail) {
    const filePath = path.join(process.cwd(), 'src', movie.thumbnail)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }

  await prisma.film.delete({ where: { id: parseInt(id) } })
  return { message: 'Film berhasil dihapus' }
}

export default { movieQueryParams, createMovie, getMovieById, updateMovie, deleteMovie }
