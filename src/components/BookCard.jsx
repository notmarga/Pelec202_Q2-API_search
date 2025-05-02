import React from 'react';
import PropTypes from 'prop-types';

function BookCard({ title, authors, publishedDate }) {
  return (
    <div className="book-card">
      <div className="title-box">{title}</div>
      <div className="author-box">{authors}</div>
      <div className="date-box">{publishedDate}</div>
    </div>
  );
}

BookCard.propTypes = {
  title: PropTypes.string.isRequired,
  authors: PropTypes.string.isRequired,
  publishedDate: PropTypes.string.isRequired,
};

export default BookCard;
