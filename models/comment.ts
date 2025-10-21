import { User } from './user';

export interface Comment {
  id: number;
  content: string;
  rating: number;
  user_id: number;
  proyect_id: number;
  parent_comment_id: number | null;
  replies?: Comment[];
  created_at: string;
}

export interface CommentWithUser extends Omit<Comment, 'user_id'> {
    user: User;
}

export interface NewComment {
    content: string;
    user_id: number;
    project_id: number;
    parent_comment_id?: number | null;
}
