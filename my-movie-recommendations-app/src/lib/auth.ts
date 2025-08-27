// JWT token management utilities
export interface User {
  id: string
  email: string
  name: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export class AuthService {
  private static TOKEN_KEY = "cineai_token"
  private static REFRESH_TOKEN_KEY = "cineai_refresh_token"
  private static USER_KEY = "cineai_user"

  static getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(this.TOKEN_KEY)
  }

  static getRefreshToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  static getUser(): User | null {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem(this.USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  }

  static setAuth(authData: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authData.token)
    localStorage.setItem(this.USER_KEY, JSON.stringify(authData.user))
    if (authData.refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, authData.refreshToken)
    }
  }

  static clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Login failed")
    }

    return response.json()
  }

  static async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Registration failed")
    }

    return response.json()
  }

  static async refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) return null

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        this.clearAuth()
        return null
      }

      const data = await response.json()
      localStorage.setItem(this.TOKEN_KEY, data.token)
      return data.token
    } catch (error) {
      this.clearAuth()
      return null
    }
  }

  static async logout(): Promise<void> {
    const token = this.getToken()
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (error) {
        console.error("Logout error:", error)
      }
    }
    this.clearAuth()
  }
}
