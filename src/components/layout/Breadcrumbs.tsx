import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectSelectedProjectData } from '../../redux/projects/projectsSelectors';

const Breadcrumbs = () => {
  const selectedProjectData = useAppSelector(selectSelectedProjectData);
  return (
    <VStack alignItems="flex-start" spacing={0}>
      <Breadcrumb fontSize={14} color="gray.600">
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/projects">
            Projects
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink
            as={RouterLink}
            to={`/projects/${selectedProjectData?.key}`}
          >
            {selectedProjectData?.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Text fontSize={24} fontWeight={600}>
        Backlog
      </Text>
    </VStack>
  );
};

export default Breadcrumbs;
