import { useCallback, useEffect, useState } from 'react';
import { EventCategoryItem } from '../types';
import { DEFAULT_CATEGORIES, getCategories, resolveCategoryLabel } from '../services/categories';

export function useCategories() {
  const [categories, setCategories] = useState<EventCategoryItem[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const list = await getCategories();
    setCategories(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const labelFor = useCallback(
    (id?: string) => resolveCategoryLabel(id, categories),
    [categories]
  );

  return { categories, loading, reload, labelFor };
}
