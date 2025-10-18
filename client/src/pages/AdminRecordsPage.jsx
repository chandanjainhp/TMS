import AdminLayout from '../components/admin/AdminLayout';
import AdminUploadedRecords from '../components/admin/AdminUploadedRecords';

const AdminRecordsPage = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col relative z-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-y-auto">
        {/* Scrollable content area */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
            <AdminUploadedRecords />
          </div>
        </main>
      </div>
    </AdminLayout>
  );
};

export default AdminRecordsPage;
