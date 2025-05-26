import { z } from 'zod';

// Esquemas de validación usando Zod
export const authSchemas = {
  login: z.object({
    email: z
      .string()
      .email('Email inválido')
      .min(1, 'Email es requerido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 símbolo'
      ),
  }),

  register: z.object({
    email: z
      .string()
      .email('Email inválido')
      .min(1, 'Email es requerido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 símbolo'
      ),
    nombre: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(50, 'El nombre no puede exceder 50 caracteres'),
    telefono: z
      .string()
      .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Número de teléfono inválido')
      .optional(),
  }),

  forgotPassword: z.object({
    email: z
      .string()
      .email('Email inválido')
      .min(1, 'Email es requerido'),
  }),

  resetPassword: z.object({
    token: z.string().min(1, 'Token es requerido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 símbolo'
      ),
  }),
};

export const userSchemas = {
  profile: z.object({
    nombre: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(50, 'El nombre no puede exceder 50 caracteres'),
    telefono: z
      .string()
      .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Número de teléfono inválido')
      .optional(),
    fecha_nacimiento: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida (YYYY-MM-DD)')
      .optional(),
  }),

  address: z.object({
    titulo: z
      .string()
      .min(1, 'Título es requerido')
      .max(100, 'Título muy largo'),
    direccion_linea_1: z
      .string()
      .min(5, 'Dirección muy corta')
      .max(200, 'Dirección muy larga'),
    direccion_linea_2: z
      .string()
      .max(200, 'Dirección muy larga')
      .optional(),
    ciudad: z
      .string()
      .min(2, 'Ciudad requerida')
      .max(100, 'Ciudad muy larga'),
    estado_provincia: z
      .string()
      .min(2, 'Estado/Provincia requerido')
      .max(100, 'Estado/Provincia muy largo'),
    codigo_postal: z
      .string()
      .min(3, 'Código postal muy corto')
      .max(20, 'Código postal muy largo'),
    pais: z
      .string()
      .min(2, 'País requerido')
      .max(100, 'País muy largo'),
    telefono: z
      .string()
      .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Número de teléfono inválido')
      .optional(),
    es_predeterminada: z.boolean().default(false),
  }),
};

export const productSchemas = {
  filter: z.object({
    categoria: z.string().optional(),
    precio_min: z.number().min(0).optional(),
    precio_max: z.number().min(0).optional(),
    busqueda: z.string().optional(),
    orden: z.enum(['precio_asc', 'precio_desc', 'nombre_asc', 'nombre_desc', 'fecha_desc']).optional(),
  }),

  review: z.object({
    calificacion: z.number().min(1).max(5),
    comentario: z
      .string()
      .min(10, 'El comentario debe tener al menos 10 caracteres')
      .max(500, 'El comentario no puede exceder 500 caracteres'),
  }),
};

// Tipos TypeScript derivados de los esquemas
export type LoginData = z.infer<typeof authSchemas.login>;
export type RegisterData = z.infer<typeof authSchemas.register>;
export type ForgotPasswordData = z.infer<typeof authSchemas.forgotPassword>;
export type ResetPasswordData = z.infer<typeof authSchemas.resetPassword>;
export type ProfileData = z.infer<typeof userSchemas.profile>;
export type AddressData = z.infer<typeof userSchemas.address>;
export type ProductFilterData = z.infer<typeof productSchemas.filter>;
export type ReviewData = z.infer<typeof productSchemas.review>;
