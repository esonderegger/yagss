import React from 'react';
import PropTypes from 'prop-types';
import Base from './Base.jsx';

const article = (props) => {
  const {
    subTemplate, relativeURL, title, description, sections,
  } = props;
  const titleNode = subTemplate ? (
    <h1><a href={relativeURL.slice(1)}>{title}</a></h1>
  ) : (
    <h1>{title}</h1>
  );
  const sectionProps = sections.map((section) => {
    return Object.keys(section).reduce((acc, cur) => {
      if (!['key', 'content', 'template'].includes(cur)) {
        acc[cur] = section[cur];
      }
      return acc;
    }, {});
  });
  const sectionElements = sections.map((section, i) => {
    const templatePath = `./${section.template}.jsx`;
    /* eslint-disable */
    const Template = require(templatePath);
    /* eslint-enable */
    const elementProps = Object.assign({}, props, sectionProps[i]);
    const element = React.createElement(Template.default, elementProps);
    return element;
  });
  const mainElement = (
    <article className="article">
      <header>
        {titleNode}
        {
          description ? (
            <p>{description}</p>
          ) : null
        }
      </header>
      {
        sections.map((section, i) => (
          <React.Fragment key={`${section.key}_key`}>
            {i > 0 ? <div id={section.key}>{sectionElements[i]}</div> : null}
            <section dangerouslySetInnerHTML={{__html: section.content}} />
          </React.Fragment>
        ))
      }
    </article>
  );
  if (subTemplate) {
    return mainElement;
  }
  return (
    <Base {...props}>
      {mainElement}
    </Base>
  );
};

article.propTypes = {
  subTemplate: PropTypes.bool,
  relativeURL: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  sections: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    content: PropTypes.string,
  })),
};

article.defaultProps = {
  children: null,
  sections: [],
  subTemplate: false,
};

export default article;
