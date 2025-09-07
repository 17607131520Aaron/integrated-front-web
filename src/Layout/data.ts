import type { IRouterItem } from '@/store/userStore/type';
import type { IMenuItem } from './type';

export const convertToMenuItems = (data: IRouterItem[]): IMenuItem[] => {
  return data.map(item => {
    return {
      id: (item.id as string) ?? item.name,
      key: (item.key as string) ?? item.name,
      label: (item.label as string) ?? item.name,
      title: (item.title as string) ?? item.name,
      code: (item.code as string) ?? item.name,
      path: item.path,
      icon: item.icon,
      sortOrder: (item.sortOrder as number) ?? 0,
      children:
        item.children && item.children.length > 0 ? convertToMenuItems(item.children) : undefined,
    };
  });
};

//系统名称
export const getSystemName = '这是个什么系统';
