const Modal = ({ open, setOpen, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-lg font-semibold mb-4 text-center">{title}</h2>
        {children}
        <button
          onClick={() => setOpen(false)}
          className="mt-4 w-full bg-gray-200 py-2 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
