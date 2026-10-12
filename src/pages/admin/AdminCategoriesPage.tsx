import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useCategories } from '../../hooks/useCategories';
import { createCategory, deleteCategory } from '../../services/categories';
import { categoryTheme } from '../../lib/categoryTheme';
import { EventCategoryItem } from '../../types';
import { Tags, PlusCircle, Trash2, AlertCircle } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, loading, reload } = useCategories();
  const [label, setLabel] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<EventCategoryItem | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const res = await createCategory(label);
    setSaving(false);
    if (res.success) {
      setLabel('');
      await reload();
    } else {
      setError(res.error || 'Could not add category.');
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    const res = await deleteCategory(toDelete.id);
    setToDelete(null);
    if (res.success) {
      await reload();
    } else {
      setError(res.error || 'Could not delete category.');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <Tags className="w-6 h-6 text-acm-cyan" /> Event Categories
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Categories appear in the event form, the Events page filters and the Gallery.
          </p>
        </div>

        <form onSubmit={handleAdd} className="glass-panel p-5 border border-slate-800 space-y-3">
          <label className="block text-xs font-semibold text-slate-300">Add a new category</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Quiz, Seminar, Coding Contest"
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-acm-cyan"
            />
            <button
              type="submit"
              disabled={saving || !label.trim()}
              className="btn-acm-primary px-4 py-2.5 text-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{saving ? 'Adding...' : 'Add'}</span>
            </button>
          </div>
          {error && (
            <p className="text-xs text-rose-300 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </p>
          )}
        </form>

        <div className="glass-panel p-5 border border-slate-800">
          {loading ? (
            <LoadingSpinner message="Loading categories..." />
          ) : categories.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No categories yet.</p>
          ) : (
            <ul className="divide-y divide-slate-800/70">
              {categories.map((c) => {
                const t = categoryTheme(c.id);
                return (
                  <li key={c.id} className="py-3 flex items-center justify-between">
                    <span className={`text-xs font-mono font-semibold px-3 py-1 rounded-full border ${t.bg} ${t.text} ${t.border}`}>
                      {c.label}
                    </span>
                    <button
                      onClick={() => setToDelete(c)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700 transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <ConfirmModal
          isOpen={Boolean(toDelete)}
          title="Delete category?"
          message={`Delete "${toDelete?.label}"? Events already using it will keep working and show the name, but it will no longer be offered in the lists.`}
          confirmLabel="Yes, Delete"
          cancelLabel="Cancel"
          isDestructive={true}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      </div>
    </AdminLayout>
  );
};
