export default function LoadingScreen() {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-white dark:bg-gray-900 ">
      <div className="relative w-[100px] h-[100px]">
        <div
          className="absolute top-0 left-0 w-[100px] h-[100px] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-gray-300 animate-leftSquare"
          style={{ transformOrigin: "center" }}
        />

        <div
          className="absolute top-0 left-0 w-[100px] h-[100px] bg-gradient-to-br from-indigo-500 to-blue-500  animate-rightSquare"
          style={{ transformOrigin: "center" }}
        />

        <div
          className="absolute w-[50px] h-[50px] bg-white dark:bg-gray-900 pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(calc(-50% + 0px), -50%) rotate(45deg)",
            zIndex: 3,
          }}
        />
      </div>
    </div>
  );
}
