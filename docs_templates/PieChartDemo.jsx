import React from 'react';
import PropTypes from 'prop-types';
/* eslint-disable import/no-extraneous-dependencies */
import {
  ResponsiveContainer, PieChart, Pie, Legend, Tooltip, Cell,
} from 'recharts';
/* eslint-enable import/no-extraneous-dependencies */

const COLORS = ['#b197fc', '#66d9e8', '#91a7ff', '#ffc078'];

const pieChartDemo = (props) => {
  const { caption, items } = props;
  return (
    <figure>
      <figcaption>{caption}</figcaption>
      <ResponsiveContainer width="100%" height="100%" aspect={1.7}>
        <PieChart>
          <Legend />
          <Pie dataKey="value" data={items} fill="#dee2e6" label>
            {
              items.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))
            }
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </figure>
  );
};

pieChartDemo.propTypes = {
  caption: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.number,
  })).isRequired,
};

export default pieChartDemo;
