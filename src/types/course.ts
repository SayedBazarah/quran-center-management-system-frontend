
import type { ITeacherItem } from './teacher';
import type { IEnrollmentItem} from './student';

export interface ICourseRounds {
  id: number;
  endDate: string;
  startDate: string;

  course: ICourseItem;
  teacher: ITeacherItem;
  enrollments: IEnrollmentItem[];
}

export interface IPrerequisite {
  prerequisiteId: number;
  prerequisite: {
    id: number;
    name: string;
    description: string;
  };
}

export interface ICourseItem {
  id: number;
  name: string;
  price: number;
  duration: number;
}

export interface ICourseTableFilters {
  name: string;
}

export interface IRoundTableFilters {
  name: string;
}
