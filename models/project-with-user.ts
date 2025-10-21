import { Project } from './project';
import { User } from './user';

export interface ProjectWithUser extends Omit<Project, 'owner'> {
    owner: User;
}
