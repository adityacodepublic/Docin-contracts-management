export {}

// Create a type for the roles
export type Roles = string;

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}