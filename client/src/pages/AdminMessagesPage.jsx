import AdminLayout from '../components/admin/AdminLayout';
import MessagingSystem from '../components/common/MessagingSystem';

const AdminMessagesPage = () => {
    return (
        <AdminLayout>
            <div className="h-[calc(100vh-5rem)] rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-4 shadow-[rgba(0,0,0,0.04)_0px_4px_18px] md:p-6">
                <div className="h-full max-w-7xl mx-auto">
                    <MessagingSystem />
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminMessagesPage;
