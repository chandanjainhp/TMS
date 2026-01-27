import AdminLayout from '../components/admin/AdminLayout';
import MessagingSystem from '../components/common/MessagingSystem';

const AdminMessagesPage = () => {
    return (
        <AdminLayout>
            <div className="p-4 md:p-6 h-[calc(100vh-5rem)]">
                <div className="h-full max-w-7xl mx-auto">
                    <MessagingSystem />
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminMessagesPage;
