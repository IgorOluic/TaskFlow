import { useAppSelector } from '../../../hooks/useAppSelector';
import CustomTable from '../../ui/CustomTable';
import ProjectTableRow from './ProjectTableRow';

const TABLE_COLUMNS = [
  { label: 'Name' },
  { label: 'Key' },
  { label: 'Lead' },
  { label: 'More Actions', options: { isNumeric: true } },
];

const ProjectsTable = () => {
  const projects = useAppSelector((state) => state.projects.projects);

  return (
    <CustomTable
      columns={TABLE_COLUMNS}
      data={projects}
      renderRow={ProjectTableRow}
    />
  );
};

export default ProjectsTable;
