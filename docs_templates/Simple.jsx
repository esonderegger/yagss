import React from 'react';

export default props => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <title>{props.title}</title>
      <link rel="canonical" href={props.url} />
      <link rel="icon" href="/favicon.png" />
      <meta name="description" content={props.description} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href={props.css_file} rel="stylesheet" />
    </head>
    <body>
      <header>
        <h1>{props.title}</h1>
        <h2>{props.description}</h2>
      </header>
      <main dangerouslySetInnerHTML={{ __html: props.content }} />
    </body>
  </html>
);
