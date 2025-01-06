import React from 'react';

export default function DefaultView({ show }) {
  if(!show) {
    return null;
  }

  return (
    <div>
      <h4>
        Please click the "Read page content" button to get page content.
      </h4>
    </div>
  )
}