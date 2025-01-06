import React from 'react';

export default function ResultView({ show }) {
  if(!show) {
    return null;
  }

  return (
    <div>
      <h4>
        Your download will start soon. Please click "Go back" if you want to start over.
      </h4>
    </div>
  )
}