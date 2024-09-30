export interface IColumn {
  name: string;
  order: number;
  id: string;
}

export interface IColumnsState {
  columns: IColumn[];
}
