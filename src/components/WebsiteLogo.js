import React from 'react';

const WebsiteLogo = ({ url }) => {
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${url}&sz=64`;
  return <img src={faviconUrl} alt="Website logo" className="w-6 h-6" />;
};

export default WebsiteLogo;