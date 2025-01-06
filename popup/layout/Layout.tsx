import React from 'react';

export default function Layout({ children }: Readonly<{ children: React.ReactNode}>) {
  return (
    <div style={{ padding: 16, border: '1px solid lightblue' }}>
      <h2>
        Invoice extractor extension (<i style={{ color: 'blue', textDecoration: 'underline' }}>v0.0.1</i>)
      </h2>
      {children}
    </div>
  )
}