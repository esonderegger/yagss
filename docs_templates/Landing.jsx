import React from 'react';
import Base from './Base.jsx';

export default (props) => {
  return (
    <Base {...props}>
      {
        props.posts.map((post, i) => {
          const Template = require(`./${post.template}.jsx`);
          const templateProps = JSON.parse(JSON.stringify(post));
          templateProps.subTemplate = true;
          templateProps.key = i;
          const element = React.createElement(Template.default, templateProps);
          return element;
        })
      }
      {
        props.next || props.prev ? (
          <footer>
          {
            props.prev ? (<a href={props.prev}>Newer</a>) : (<div />)
          }
          {
            props.next ? (<a href={props.next}>Older</a>) : (<div />)
          }
          </footer>
        ) : null
      }
    </Base>
  );
};
