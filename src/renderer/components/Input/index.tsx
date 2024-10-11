import React, { useState } from 'react';

interface TextInputProps {
  onSubmit: (input: string) => void;
  placeholder?: string;
}

const TextInput: React.FC<TextInputProps> = ({ onSubmit, placeholder = 'Ask me anything...' }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mt-8">
      <div className="flex items-center border-b-2 border-blue-500 py-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
        />
        <button
          type="submit"
          className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded transition duration-300 ease-in-out"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default TextInput;
