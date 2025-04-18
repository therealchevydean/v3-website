export function Button({ children }) {
  return (
    <button className="px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition">
      {children}
    </button>
  );
}
