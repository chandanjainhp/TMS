import MessagingSystem from "../components/common/MessagingSystem";

const MessagingPage = () => {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6">
      <div className="rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-4 shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
        <MessagingSystem />
      </div>
    </div>
  );
};

export default MessagingPage;
