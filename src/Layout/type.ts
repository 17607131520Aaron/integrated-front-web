export interface IMenuItem {
  id: string;
  key: string;
  title: string;
  label: string;
  code: string;
  path: string;
  icon?: React.ReactNode | null;
  sortOrder: number;
  children?: Array<IMenuItem> | undefined;
}
