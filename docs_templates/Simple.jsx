import React from 'react';
import PropTypes from 'prop-types';

const simple = (props) => {
  const {
    title, url, description, cssFile, content
  } = props;
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <link rel="canonical" href={url} />
        <link rel="icon" href="/favicon.png" />
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href={cssFile} rel="stylesheet" />
      </head>
      <body>
        <header>
          <h1>{title}</h1>
          <h2>{description}</h2>
        </header>
        <main dangerouslySetInnerHTML={{ __html: content }} />
      </body>
    </html>
  );
};

simple.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  cssFile: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default simple;
