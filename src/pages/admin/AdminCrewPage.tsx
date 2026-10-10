import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { CrewMember } from '../../types';
import { getCrew, createCrewMember, updateCrewMember, deleteCrewMember } from '../../services/crew';
import { uploadImage } from '../../services/storage';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { 
  Users, 
  PlusCircle, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Upload, 
  X, 
  Save, 
  AlertCircle,
  CheckCircle2,
  User as UserIcon
} from 'lucide-react';

export const AdminCrewPage: React.FC = () => {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CrewMember | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [branch, setBranch] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [bio, setBio] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isPublished, setIsPublished] = useState(true);
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');
  const [email, setEmail] = useState('');

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<CrewMember | null>(null);

  useEffect(() => {
    loadCrew();
  }, []);

  async function loadCrew() {
    setLoading(true);
    try {
      const data = await getCrew(true); // Include unpublished crew
      setCrew(data);
    } catch (err) {
      console.error('Failed to load crew members:', err);
    } finally {
      setLoading(false);
    }
  }

  const openCreateModal = () => {
    setEditingMember(null);
    setName('');
    setRole('');
    setBranch('Computer Science & Engineering (CSE)');
    setAcademicYear('3rd Year (B.Tech)');
    setPhotoUrl('');
    setBio('');
    setDisplayOrder(crew.length + 1);
    setIsPublished(true);
    setLinkedin('');
    setGithub('');
    setTwitter('');
    setEmail('');
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (m: CrewMember) => {
    setEditingMember(m);
    setName(m.name);
    setRole(m.role);
    setBranch(m.branch || '');
    setAcademicYear(m.academic_year || '');
    setPhotoUrl(m.photo_url || '');
    setBio(m.bio || '');
    setDisplayOrder(m.display_order);
    setIsPublished(m.is_published);
    setLinkedin(m.social_links?.linkedin || '');
    setGithub(m.social_links?.github || '');
    setTwitter(m.social_links?.twitter || '');
    setEmail(m.social_links?.email || '');
    setFormError(null);
    setModalOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setFormError(null);

    try {
      const res = await uploadImage(file, 'crew-photos');
      if (res.error) {
        setFormError(res.error);
      } else {
        setPhotoUrl(res.url);
      }
    } catch (err: any) {
      setFormError(err.message || 'Photo upload failed');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Member Name is required.');
      return;
    }

    if (!role.trim()) {
      setFormError('Member Role / Designation is required.');
      return;
    }

    setSaving(true);

    const memberPayload = {
      name: name.trim(),
      role: role.trim(),
      branch: branch.trim() || undefined,
      academic_year: academicYear.trim() || undefined,
      photo_url: photoUrl.trim() || undefined,
      bio: bio.trim() || undefined,
      display_order: Number(displayOrder) || 1,
      is_published: isPublished,
      social_links: {
        linkedin: linkedin.trim() || undefined,
        github: github.trim() || undefined,
        twitter: twitter.trim() || undefined,
        email: email.trim() || undefined,
      },
    };

    try {
      if (editingMember) {
        const res = await updateCrewMember(editingMember.id, memberPayload);
        if (res.success && res.crew) {
          setCrew((prev) =>
            prev.map((c) => (c.id === editingMember.id ? res.crew! : c))
          );
          setModalOpen(false);
        } else {
          setFormError(res.error || 'Failed to update member.');
        }
      } else {
        const res = await createCrewMember(memberPayload);
        if (res.success && res.crew) {
          setCrew((prev) => [...prev, res.crew!]);
          setModalOpen(false);
        } else {
          setFormError(res.error || 'Failed to create member.');
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'An error occurred while saving crew member.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVisibility = async (m: CrewMember) => {
    const updatedStatus = !m.is_published;
    try {
      await updateCrewMember(m.id, { is_published: updatedStatus });
      setCrew((prev) =>
        prev.map((c) => (c.id === m.id ? { ...c, is_published: updatedStatus } : c))
      );
    } catch (e) {
      console.error('Failed to toggle visibility:', e);
    }
  };

  const handleDeleteClick = (m: CrewMember) => {
    setMemberToDelete(m);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    try {
      await deleteCrewMember(memberToDelete.id);
      setCrew((prev) => prev.filter((c) => c.id !== memberToDelete.id));
    } catch (err) {
      console.error('Failed to delete member:', err);
    } finally {
      setDeleteModalOpen(false);
      setMemberToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-xl text-white">
              Crew & Leadership Management
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage student executive leads, designations, display ordering, and photos.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="btn-acm-primary text-xs px-3.5 py-2 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Crew Member</span>
          </button>
        </div>

        {/* Crew Table */}
        {loading ? (
          <LoadingSpinner message="Loading crew records..." />
        ) : crew.length > 0 ? (
          <div className="glass-panel overflow-hidden border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] bg-navy-950/70">
                    <th className="py-3.5 px-4 font-semibold">Order</th>
                    <th className="py-3.5 px-4 font-semibold">Member</th>
                    <th className="py-3.5 px-3 font-semibold">Role / Title</th>
                    <th className="py-3.5 px-3 font-semibold">Branch & Year</th>
                    <th className="py-3.5 px-3 font-semibold">Visibility</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {crew.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        #{member.display_order}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl overflow-hidden bg-navy-950 border border-slate-800 shrink-0">
                            {member.photo_url ? (
                              <img
                                src={member.photo_url}
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500">
                                <UserIcon className="w-4 h-4 text-acm-cyan/60" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-white text-xs">{member.name}</p>
                            {member.social_links?.email && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                {member.social_links.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap text-acm-light font-medium">
                        {member.role}
                      </td>

                      <td className="py-3.5 px-3 text-slate-400 max-w-xs truncate">
                        {[member.branch, member.academic_year].filter(Boolean).join(' • ') || 'N/A'}
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                          member.is_published
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {member.is_published ? 'Published' : 'Hidden'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleToggleVisibility(member)}
                            className={`p-1.5 rounded-lg border text-xs transition-colors ${
                              member.is_published
                                ? 'bg-slate-800 text-slate-300 hover:text-amber-400 border-slate-700'
                                : 'bg-emerald-950/60 text-emerald-300 hover:text-emerald-200 border-emerald-500/40'
                            }`}
                            title={member.is_published ? 'Hide from public site' : 'Make visible publicly'}
                          >
                            {member.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => openEditModal(member)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                            title="Edit Details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteClick(member)}
                            className="p-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-500/20 transition-colors"
                            title="Delete Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-16 text-center text-slate-400 border border-slate-800">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No crew members recorded</h3>
            <p className="text-xs text-slate-400 mt-1">
              Add your executive committee and chapter leads.
            </p>
          </div>
        )}

        {/* Create / Edit Modal Dialog */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
            <div className="w-full max-w-2xl rounded-3xl glass-panel p-6 sm:p-8 border border-slate-700/80 shadow-2xl relative my-8">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-display font-bold text-xl text-white mb-1">
                {editingMember ? 'Edit Crew Member' : 'Add New Crew Member'}
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Update leadership role, branch, photo, and professional links.
              </p>

              {formError && (
                <div className="mb-6 p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSaveMember} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sneha Reddy"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-acm-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Role / Designation <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vice Chairperson / Technical Lead"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-acm-cyan"
                    />
                  </div>
                </div>

                {/* Photo Upload & Preview */}
                <div className="p-4 rounded-2xl bg-navy-950/60 border border-slate-800">
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-navy-900 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                      {photoUrl ? (
                        <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-7 h-7 text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="btn-acm-secondary text-xs px-3 py-1.5 cursor-pointer inline-flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingPhoto ? 'Uploading...' : 'Upload Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                          disabled={uploadingPhoto}
                        />
                      </label>
                      <input
                        type="url"
                        placeholder="or paste image URL"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-navy-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-acm-cyan"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Branch / Department
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Science & Engineering (CSE)"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-acm-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3rd Year (B.Tech) or Professor"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-acm-cyan"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Short Bio
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief background, domain interests, and leadership responsibilities..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-acm-cyan resize-none"
                  />
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">LinkedIn Profile</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-navy-950 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">GitHub Profile</label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-navy-950 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Twitter / X</label>
                    <input
                      type="url"
                      placeholder="https://x.com/..."
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-navy-950 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Official Email</label>
                    <input
                      type="email"
                      placeholder="lead@mbu.asia"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-navy-950 border border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>

                {/* Display Order & Visibility */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Display Priority Order
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-white text-xs"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Lower numbers display first (e.g. 1 = Sponsor/Chair).</span>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="w-4 h-4 rounded text-acm-cyan bg-navy-950 border-slate-700 focus:ring-0"
                      />
                      <span className="text-xs font-semibold text-slate-300">
                        Visible on Public Crew Page
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-acm-primary px-5 py-2 text-xs flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? 'Saving...' : 'Save Member Record'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteModalOpen}
          title="Remove Crew Member?"
          message={`Are you sure you want to remove ${memberToDelete?.name} from the crew roster?`}
          confirmLabel="Yes, Remove"
          cancelLabel="Cancel"
          isDestructive={true}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
        />

      </div>
    </AdminLayout>
  );
};
