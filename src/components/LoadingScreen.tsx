export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <div className="relative w-[80px] h-[80px]">
        <div
          className="absolute top-0 left-0 w-[80px] h-[80px] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-gray-300 animate-leftSquare"
          style={{ transformOrigin: "center" }}
        />
        <div
          className="absolute top-0 left-0 w-[80px] h-[80px] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-gray-300 animate-rightSquare"
          style={{ transformOrigin: "center" }}
        />
        <div
          className="absolute w-[40px] h-[40px] bg-white dark:bg-gray-900 pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(45deg)",
            zIndex: 3,
          }}
        />
      </div>
    </div>
  );
}
