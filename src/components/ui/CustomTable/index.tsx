/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  TableColumnHeaderProps,
} from '@chakra-ui/react';

interface ITableColumn {
  label: string;
  options?: TableColumnHeaderProps;
}

interface CustomTableProps {
  columns: ITableColumn[];
  data: any[];
  renderRow: React.FC<{ rowData: any }>;
}

const CustomTable = ({
  columns,
  data,
  renderRow: RenderRowComponent,
}: CustomTableProps) => {
  const renderTableColumn = (
    column: ITableColumn,
    index: number,
  ): JSX.Element => {
    return (
      <Th {...column.options} key={index}>
        {column.label}
      </Th>
    );
  };

  const renderTableRow = (rowData: any, index: number) => {
    return <RenderRowComponent key={index} rowData={rowData} />;
  };

  return (
    <TableContainer w="full">
      <Table variant="simple">
        <Thead>
          <Tr>{columns.map(renderTableColumn)}</Tr>
        </Thead>
        <Tbody>{data.map(renderTableRow)}</Tbody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
