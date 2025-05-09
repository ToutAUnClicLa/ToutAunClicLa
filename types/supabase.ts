export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          nombre: string
          email: string
          contraseña: string | null
          fecha_creacion: string | null
          autenticacion_social: boolean | null
        }
        Insert: {
          id?: never
          nombre: string
          email: string
          contraseña?: string | null
          fecha_creacion?: string | null
          autenticacion_social?: boolean | null
        }
        Update: {
          id?: never
          nombre?: string
          email?: string
          contraseña?: string | null
          fecha_creacion?: string | null
          autenticacion_social?: boolean | null
        }
      }
      productos: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          precio: number
          categoria_id: string | null
          stock: number | null
          fecha_creacion: string | null
          imagen_principal: string | null
          subcategoria_id: string | null
        }
        Insert: {
          id?: never
          nombre: string
          descripcion?: string | null
          precio: number
          categoria_id?: string | null
          stock?: number | null
          fecha_creacion?: string | null
          imagen_principal?: string | null
          subcategoria_id?: string | null
        }
        Update: {
          id?: never
          nombre?: string
          descripcion?: string | null
          precio?: number
          categoria_id?: string | null
          stock?: number | null
          fecha_creacion?: string | null
          imagen_principal?: string | null
          subcategoria_id?: string | null
        }
      }
      categorias: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
        }
        Insert: {
          id?: never
          nombre: string
          descripcion?: string | null
        }
        Update: {
          id?: never
          nombre?: string
          descripcion?: string | null
        }
      }
      subcategorias: {
        Row: {
          id: string
          nombre: string
          categoria_id: string | null
        }
        Insert: {
          id?: never
          nombre: string
          categoria_id?: string | null
        }
        Update: {
          id?: never
          nombre?: string
          categoria_id?: string | null
        }
      }
      favoritos: {
        Row: {
          id: string
          usuario_id: string
          producto_id: string
          fecha_agregado: string | null
        }
        Insert: {
          id?: never
          usuario_id: string
          producto_id: string
          fecha_agregado?: string | null
        }
        Update: {
          id?: never
          usuario_id?: string
          producto_id?: string
          fecha_agregado?: string | null
        }
      }
      carrito: {
        Row: {
          id: string
          usuario_id: string | null
          producto_id: string | null
          cantidad: number
        }
        Insert: {
          id?: never
          usuario_id?: string | null
          producto_id?: string | null
          cantidad?: number
        }
        Update: {
          id?: never
          usuario_id?: string | null
          producto_id?: string | null
          cantidad?: number
        }
      }
    }
  }
}