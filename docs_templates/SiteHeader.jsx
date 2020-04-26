import React from 'react';
import PropTypes from 'prop-types';

const siteHeader = (props) => {
  const { relativeDir } = props;
  const amountNested = (relativeDir.match(/\//g) || []).length;
  const relativePrefix = '../'.repeat(amountNested);
  return (
    <section className="site-header">
      <header>
        <h1>Yagss</h1>
        <h2>Yet another generator for static sites</h2>
      </header>
      <nav>
        <ul>
          <li><a href={`${relativePrefix}index.html`}>Home</a></li>
          <li><a href={`${relativePrefix}examples.html`}>Examples</a></li>
          <li><a href="https://github.com/esonderegger/yagss">Source</a></li>
        </ul>
      </nav>
    </section>
  );
};

siteHeader.propTypes = {
  relativeDir: PropTypes.string.isRequired,
};

export default siteHeader;
