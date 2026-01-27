import AdminLayout from '../components/admin/AdminLayout';
import RecordsList from '../components/records/RecordsList';

const AdminRecordsPage = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col relative z-10 bg-slate-50 w-full min-h-screen">
        {/* Scrollable content area */}
        <main className="flex-1">
          <div className="w-full px-4 py-4">
            <RecordsList />
          </div>
        </main>
      </div>
    </AdminLayout>
  );
};

export default AdminRecordsPage;
