import AdminLayout from '../components/admin/AdminLayout';
import AdminTeacherLog from '../components/admin/AdminTeacherLog';

const AdminTeacherLogPage = () => {
  return (
    <AdminLayout>
      <div className="rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-4 shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
        <AdminTeacherLog />
      </div>
    </AdminLayout>
  );
};

export default AdminTeacherLogPage;
