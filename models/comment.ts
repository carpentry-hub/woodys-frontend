export interface Comment {
  id: number;
  content: string;
  rating: number;
  user: number;
  proyect_id: number;
  parent_comment_id: number | null;
}
