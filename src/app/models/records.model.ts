// Describes a single activity record from the API's "results" array
export interface Activity {
  id: string;
  db_id: number;
  url: string;
  start_date: string;
  end_date: string;
  country_exact: string;
  region_exact: string;
  activity_exact: string;
  objective_exact: string;
  thematic_exact: string;
  directorate_exact: string;
}

export interface DbActivity {
  id: string;
  db_id: number;
  url: string;
  start_date: string;
  end_date: string;
  country: string;
  region: string;
  activity: string;
  objective: string;
  thematic: string;
  directorate: string;
}
// Describes the entire JSON response from your Django API
export interface PaginatedResponse<T> {
  count: number;
  total_pages: number;
  current_page: number;
  next_page: number | null;
  previous_page: number | null;
  results: T[];
}