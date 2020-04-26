import React from 'react';
import PropTypes from 'prop-types';
import SiteHeader from './SiteHeader.jsx';

const base = (props) => {
  const {
    title, url, description, cssFile, children, bundledJS, relativeDir,
  } = props;
  const amountNested = (relativeDir.match(/\//g) || []).length;
  const relativePrefix = '../'.repeat(amountNested);
  const jsBundles = bundledJS || [];
  const relativeJS = jsBundles.map((js) => `${relativePrefix}${js.slice(1)}`);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <link rel="canonical" href={url} />
        <link rel="icon" href={`${relativePrefix}favicon-32x32.png`} />
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href={`${relativePrefix}${cssFile}`} rel="stylesheet" />
      </head>
      <body>
        <SiteHeader relativeDir={relativeDir} />
        <main>{children}</main>
        {
          bundledJS ? relativeJS.map((s) => <script src={s} key={s} />) : null
        }
      </body>
    </html>
  );
};

base.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  cssFile: PropTypes.string.isRequired,
  relativeDir: PropTypes.string.isRequired,
  children: PropTypes.node,
  bundledJS: PropTypes.arrayOf(PropTypes.string),
};

base.defaultProps = {
  children: null,
  bundledJS: [],
};

export default base;
