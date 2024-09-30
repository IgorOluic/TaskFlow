export interface IColumn {
  name: string;
  order: number;
  id: string;
}

export type ColumnsData = Record<string, IColumn>;

export interface IColumnsState {
  columnIds: string[];
  columnsData: ColumnsData;
}
