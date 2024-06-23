import React, { useState, useEffect } from 'react';
import { Liquid } from 'liquidjs';

interface LiquidTemplateProps {
  template: string;
  data: Record<string, any>;
  className?: string;
  style?: React.CSSProperties;
}

const LiquidTemplate: React.FC<LiquidTemplateProps> = async ({ template, data, className, ...props }) => {

    const engine = new Liquid();
    const html = await engine.parseAndRender(template, data)

  return <div dangerouslySetInnerHTML={{ __html: html }} className={className} {...props} />;
};

export default LiquidTemplate;