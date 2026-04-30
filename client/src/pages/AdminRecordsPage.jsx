import AdminLayout from '../components/admin/AdminLayout';
import RecordsList from '../components/records/RecordsList';

const AdminRecordsPage = () => {
  return (
    <AdminLayout>
      <div className="w-full rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-4 shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
        <RecordsList />
      </div>
    </AdminLayout>
  );
};

export default AdminRecordsPage;
