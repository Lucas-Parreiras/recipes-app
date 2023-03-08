import PropTypes from 'prop-types';
import React, { useState } from 'react';
import copy from 'clipboard-copy';
import image from '../images/shareIcon.svg';
import greenCheck from '../images/greenCheck.png';

export default function ShareRecipeButton({ index, id, type }) {
  const [showLinkCopiedMessage, setShowLinkCopiedMessage] = useState(false);

  const copyLinkToClipBoard = () => {
    const TIME = 4000;
    copy(`http://localhost:3000/${type}s/${id}`);
    setShowLinkCopiedMessage(true);
    setTimeout(() => setShowLinkCopiedMessage(false), TIME);
  };

  return (
    <div className="share-button-container">
      <button
        className="share-recipe-btn"
        onClick={ copyLinkToClipBoard }
        disabled={ showLinkCopiedMessage }
      >
        { showLinkCopiedMessage ? (
          <div>
            <img
              src={ greenCheck }
              alt="copiado com sucesso"
            />
            Link copied!
          </div>
        )
          : (
            <img
              data-testid={ `${index}-horizontal-share-btn` }
              src={ image }
              alt="botão de compartilhar receita"
            />)}
      </button>
    </div>

  );
}

ShareRecipeButton.propTypes = {
  index: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};
