'use client';

import React, { useState, useEffect } from 'react';
import { Liquid } from 'liquidjs';

interface LiquidTemplateProps {
  template: string;
  data: Record<string, any>;
}

const LiquidTemplate: React.FC<LiquidTemplateProps> = ({ template, data }) => {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    const engine = new Liquid();
    engine.parseAndRender(template, data).then((result) => {
      setHtml(result);
    });
  }, [template, data]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default LiquidTemplate;