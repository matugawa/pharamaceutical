const gradientClasses = [
  "bg-gradient-to-r from-pink-300 via-pink-200 to-pink-100",
  "bg-gradient-to-r from-purple-300 via-purple-200 to-purple-100",
  "bg-gradient-to-r from-blue-300 via-blue-200 to-blue-100",
  "bg-gradient-to-r from-green-300 via-green-200 to-green-100",
  "bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100",
  "bg-gradient-to-r from-red-300 via-red-200 to-red-100",
];

export const Loading = () => {
  const items = Array.from({ length: 12 });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
      <div className="relative w-24 h-24 animate-spin-slow">
        {items.map((_, i) => {
          const gradient = gradientClasses[i % gradientClasses.length];
          return (
            <div
              key={i}
              className={`absolute w-2.5 h-2.5 rounded-sm ${gradient} animate-colorShift`}
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${i * 30}deg) translate(40px)`,
                transformOrigin: "center",
                animationDelay: `${(i * 0.1).toFixed(2)}s`,
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};
