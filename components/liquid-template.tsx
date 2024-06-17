'use client';

import React, { useState, useEffect } from 'react';
import { Liquid } from 'liquidjs';

interface LiquidTemplateProps {
  template: string;
  data: Record<string, any>;
  className?: string;
  style?: React.CSSProperties;
}

const LiquidTemplate: React.FC<LiquidTemplateProps> = ({ template, data, className, ...props }) => {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    const engine = new Liquid();
    engine.parseAndRender(template, data).then((result) => {
      setHtml(result);
    });
  }, [template, data]);

  return <div dangerouslySetInnerHTML={{ __html: html }} className={className} {...props} />;
};

export default LiquidTemplate;