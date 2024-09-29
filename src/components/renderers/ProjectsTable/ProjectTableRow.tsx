import {
  Tr,
  Td,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Center,
} from '@chakra-ui/react';
import { IProjectWithOwnerDetails } from '../../../redux/projects/projectsTypes';
import CustomLink from '../../ui/CustomLink';
import SvgIcon from '../../ui/SvgIcon';
import UserAvatar from '../../ui/UserAvatar';
import ProjectIcon from '../../ui/ProjectIcon';

interface CustomTableProps {
  rowData: IProjectWithOwnerDetails;
}

const ProjectTableRow = ({ rowData }: CustomTableProps) => {
  return (
    <Tr>
      <Td mr={0} pr={0}>
        <ProjectIcon
          iconUrl={rowData.iconUrl}
          defaultIconId={rowData.defaultIconId}
        />
      </Td>
      <Td ml={2} pl={2}>
        <CustomLink to={`/projects/${rowData.key || 'asd'}`} color="purple.600">
          {rowData.name}
        </CustomLink>
      </Td>
      <Td>{rowData.key}</Td>
      <Td>
        <UserAvatar
          firstName={rowData.ownerDetails.firstName}
          lastName={rowData.ownerDetails.lastName}
          showFullName
        />
      </Td>
      <Td textAlign="right">
        <Menu>
          <MenuButton>
            <Center
              p={2}
              w="24px"
              h="24px"
              _hover={{
                backgroundColor: 'gray.200',
              }}
            >
              <SvgIcon name="verticalDots" width="4px" height="16px" />
            </Center>
          </MenuButton>
          <MenuList>
            <MenuItem>View Details</MenuItem>
            <MenuItem>Project Settings</MenuItem>
            <MenuItem>Delete</MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );
};

export default ProjectTableRow;
