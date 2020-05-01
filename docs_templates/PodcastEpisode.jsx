import React from 'react';
import PropTypes from 'prop-types';
import Base from './Base.jsx';

const podcastEpisode = (props) => {
  const {
    subTemplate, relativeURL, title, description, content,
  } = props;
  const titleNode = subTemplate ? (
    <h1><a href={relativeURL.slice(1)}>{title}</a></h1>
  ) : (
    <h1>{title}</h1>
  );
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
      <section dangerouslySetInnerHTML={{__html: content}} />
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

podcastEpisode.propTypes = {
  subTemplate: PropTypes.bool,
  relativeURL: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

podcastEpisode.defaultProps = {
  subTemplate: false,
};

export default podcastEpisode;
