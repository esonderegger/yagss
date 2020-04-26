import React from 'react';
import PropTypes from 'prop-types';
import SiteHeader from './SiteHeader.jsx';

const simple = (props) => {
  const {
    title, url, description, cssFile, content, relativeDir,
  } = props;
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <link rel="canonical" href={url} />
        <link rel="icon" href="favicon-32x32.png" />
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href={cssFile} rel="stylesheet" />
      </head>
      <body>
        <SiteHeader relativeDir={relativeDir} />
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
  relativeDir: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default simple;
