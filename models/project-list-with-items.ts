import { ProjectList } from './project-list';
import { Project } from './project';

export interface ProjectListWithItems extends ProjectList {
  projects: Project[];
}
