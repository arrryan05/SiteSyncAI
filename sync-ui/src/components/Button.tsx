interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    fullWidth?: boolean;
  }
  
  export default function Button({ fullWidth, children, ...rest }: ButtonProps) {
    return (
      <button
        {...rest}
        className={`
          bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded font-semibold 
          hover:opacity-90 disabled:opacity-50 ${fullWidth ? "w-full" : ""}
        `}
      >
        {children}
      </button>
    );
  }
  