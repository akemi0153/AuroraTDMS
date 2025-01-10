import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, children, videoUrl }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!isOpen) return null;

  const content = videoUrl ? (
    <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-lg">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Close video"
      >
        <X size={24} />
      </button>
      <div className="aspect-video">
        <iframe
          src={videoUrl}
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full h-full rounded-lg"
          title="Demo Video"
        />
      </div>
    </div>
  ) : (
    <div className="bg-white p-6 rounded shadow-lg">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Close modal"
      >
        <X size={24} />
      </button>
      {children}
    </div>
  );

  return typeof document !== "undefined"
    ? ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          {content}
        </div>,
        document.body
      )
    : null;
};

export default Modal;
