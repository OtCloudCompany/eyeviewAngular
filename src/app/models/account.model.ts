export interface UserProfile {
    id: string;
    first_name: string; 
    last_name: string; 
    email: string; 
    public_id: string; 
    token_type: string;
    exp: number; // Expiration time
    iat: number;
    jti: string;
  }

  export interface PaginatedUserResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
  }