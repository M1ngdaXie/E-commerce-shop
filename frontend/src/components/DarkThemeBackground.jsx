export default function DarkThemeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#0d1117] dark:bg-[#0d1117]">
        {/* Optional subtle pattern/texture */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#484f58_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>
    </div>
  );
}
