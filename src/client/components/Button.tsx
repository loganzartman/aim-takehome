export default function Button({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
}) {
  return (
    <button
      className={[
        'transition-colors text-white font-bold py-2 px-4 rounded',
        disabled ? 'bg-slate-400' : 'bg-blue-500 hover:bg-blue-700',
      ].join(' ')}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
