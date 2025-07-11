import z from 'zod'

export const createMovieValidation = z.object({
  judul: z.string().trim().min(3, 'Judul minimal 3 karakter'),
  durasi: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || !isNaN(val), { message: 'Durasi harus angka' }),
  rating: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || !isNaN(val), { message: 'Rating harus angka' }),
  deskripsi: z.string().trim().min(3, 'Deskripsi minimal 3 karakter').optional(),
  genres: z
    .union([z.string(), z.array(z.string())])
    .refine((val) => val && (Array.isArray(val) ? val.length > 0 : true), {
      message: 'Genres wajib diisi',
    }),
})

export const updateMovieValidation = createMovieValidation.partial()

export const movieQueryValidation = z.object({
  search: z.string().optional(),
  genre: z.string().optional(),
  sort: z.enum(['asc', 'desc']).optional(),
  sortBy: z.enum(['judul', 'createdAt']).optional(),
  page: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(val)),
  limit: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(val)),
})
