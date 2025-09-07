import { useState } from 'react';
import type { IMenuItem } from './type';

interface IUseLayout {
  routerState: IMenuItem[];
}

const useLayout = ({ routerState }: IUseLayout) => {
  const [searchText, setSearchText] = useState<string>('');

  // 根据搜索文本过滤菜单
  const filterMenu = (items: IMenuItem[]): IMenuItem[] => {
    if (!items || items.length === 0) return [];
    return items.filter(item => {
      const match = item.title.toLowerCase().includes(searchText.toLowerCase());
      if (item.children) {
        const childMatch = filterMenu(item.children);
        return childMatch.length > 0 || match;
      }
      return match;
    });
  };

  const getSelectedKeys = () => {
    return (routerState || [])
      .flatMap((item: IMenuItem) => getAllPaths(item))
      .filter((p: { path: string }) => p.path === location.pathname)
      .map((p: { id: string }) => p.id);
  };

  // 递归获取所有路径
  const getAllPaths = (item: IMenuItem): Array<{ id: string; path: string }> => {
    if (item.path) return [{ id: item.id, path: item.path }];
    return item.children?.flatMap(getAllPaths) || [];
  };

  return { filterMenu, setSearchText, getSelectedKeys };
};

export default useLayout;
