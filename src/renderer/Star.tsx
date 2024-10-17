import React, { useEffect, useState } from 'react';

interface StarProps {
  duration?: number; // Duration in milliseconds
}

const Star: React.FC<StarProps> = () => {


 



  return (
    <div className='bg-transparent w-screen h-screen flex justify-center items-center '>
      ⭐
    </div>
  );
};

export default Star;

