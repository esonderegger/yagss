import React from 'react';
import PropTypes from 'prop-types';

const imageFigure = (props) => {
  const {
    image, caption, images, relativeDir, imgSizes, siteUrl,
  } = props;
  const theImage = images.find((img) => img.filename === image);
  if (!theImage) return null;
  const theCaption = caption || theImage.caption || image;
  const sources = imgSizes.map((size) => ({
    src: `${siteUrl}${relativeDir}/${image}-${size}px.jpg`,
    size,
  }));
  const srcSet = sources.map((source) => `${source.src} ${source.size}w`).join(', ');
  return (
    <figure>
      <img
        src={sources[0].src}
        alt={theCaption}
        intrinsicsize={`${theImage.width} x ${theImage.height}`}
        srcSet={srcSet}
      />
      <figcaption>{theCaption}</figcaption>
    </figure>
  );
};

imageFigure.propTypes = {
  image: PropTypes.string.isRequired,
  caption: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.shape({
    caption: PropTypes.string,
    value: PropTypes.number,
  })),
  relativeDir: PropTypes.string.isRequired,
  siteUrl: PropTypes.string.isRequired,
  imgSizes: PropTypes.arrayOf(PropTypes.number).isRequired,
};

imageFigure.defaultProps = {
  caption: null,
  images: [],
};

export default imageFigure;
